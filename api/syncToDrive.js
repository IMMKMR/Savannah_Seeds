import { getGoogleAuth, google } from './_google.js';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from 'stream';

export default async function handler(req, res) {
    // Allow GET so it can be easily hit by a simple Cron ping
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const auth = getGoogleAuth([
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
        ]);
        const sheets = google.sheets({ version: 'v4', auth });

        // 1. Fetch rows from Google Sheet to find a pending video
        const sheetData = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:E',
        });

        const rows = sheetData.data.values;
        if (!rows || rows.length <= 1) {
            return res.status(200).json({ message: "Sheet is empty or only has headers" });
        }

        let pendingRowIndex = -1;
        let pendingUrl = '';
        
        // Find the first row that still has an R2 URL
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][4] && rows[i][4].includes('r2.dev')) {
                pendingRowIndex = i;
                pendingUrl = rows[i][4];
                break;
            }
        }

        if (pendingRowIndex === -1) {
            return res.status(200).json({ message: "No pending R2 videos found in the sheet" });
        }

        console.log(`Syncing row ${pendingRowIndex + 1}: ${pendingUrl}`);

        // 2. Download from R2
        const fileRes = await fetch(pendingUrl);
        if (!fileRes.ok) throw new Error(`Failed to download from R2: ${fileRes.statusText}`);
        
        const contentType = fileRes.headers.get('content-type') || 'video/mp4';
        const arrayBuffer = await fileRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        // 3. Upload to Google Drive
        const drive = google.drive({ version: 'v3', auth });
        
        // Extract filename from URL (e.g. farmer_video_12345.mp4)
        const filename = pendingUrl.split('/').pop();
        
        const driveRes = await drive.files.create({
            requestBody: {
                name: filename,
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
            },
            media: {
                mimeType: contentType,
                body: stream,
            },
            supportsAllDrives: true,
        });

        const fileId = driveRes.data.id;
        if (!fileId) {
            throw new Error('Upload to Drive failed silently (no fileId returned). Aborting sync.');
        }

        // 4. Make file viewable on Google Drive
        try {
            await drive.permissions.create({
                fileId,
                supportsAllDrives: true,
                requestBody: { role: 'reader', type: 'anyone' },
            });
        } catch (permErr) {
            console.warn('Could not set public permission:', permErr.message);
        }

        // 5. Get the Drive sharing URL
        const fileData = await drive.files.get({
            fileId,
            fields: 'webViewLink',
            supportsAllDrives: true,
        });
        const driveUrl = fileData.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

        // 6. Update the specific row in Google Sheet with the new Drive URL
        const sheetUpdateRes = await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `Sheet1!E${pendingRowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[driveUrl]],
            },
        });

        if (sheetUpdateRes.status !== 200) {
            throw new Error(`Google Sheet update failed with status ${sheetUpdateRes.status}. Aborting R2 deletion to prevent data loss.`);
        }

        // 7. CRITICAL: Only delete the original file from Cloudflare R2 if ALL steps above succeeded
        const S3 = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
        });

        await S3.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME || 'covana',
            Key: filename,
        }));

        return res.status(200).json({ 
            success: true, 
            message: `Synced ${filename} to Google Drive and removed from R2`,
            newUrl: driveUrl
        });

    } catch (error) {
        console.error('Error in sync script:', error);
        return res.status(500).json({ error: error.message });
    }
}
