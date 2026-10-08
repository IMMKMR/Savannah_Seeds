import { getGoogleAuth, google } from './_google.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, location, mobile, fileId } = req.body || {};

        if (!fileId) {
            return res.status(400).json({ error: 'Missing fileId' });
        }

        const auth = getGoogleAuth([
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
        ]);

        const drive = google.drive({ version: 'v3', auth });

        // Try to make the video viewable via link. Non-fatal: some Workspace
        // policies block "anyone with link" sharing — the row should still save.
        try {
            await drive.permissions.create({
                fileId,
                supportsAllDrives: true,
                requestBody: { role: 'reader', type: 'anyone' },
            });
        } catch (permErr) {
            console.warn('Could not set public permission (continuing):', permErr.message);
        }

        // Get the viewable link
        const fileData = await drive.files.get({
            fileId,
            fields: 'webViewLink',
            supportsAllDrives: true,
        });
        const videoUrl = fileData.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

        // Save data to Google Sheets
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:E', // Timestamp | Name | Location | Mobile | Video URL
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[new Date().toISOString(), name, location, mobile, videoUrl]],
            },
        });

        return res.status(200).json({ success: true, videoUrl });
    } catch (error) {
        console.error('Error saving data to Sheets:', error);
        return res.status(500).json({ error: error.message });
    }
}
