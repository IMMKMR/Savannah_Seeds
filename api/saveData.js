import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, location, mobile, fileId } = req.body;

        const auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file']
        );

        // Optional: Make the uploaded video public so the dashboard can read it
        const drive = google.drive({ version: 'v3', auth });
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });
        
        // Get the viewable link
        const fileData = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink'
        });
        const videoUrl = fileData.data.webViewLink;

        // Save data to Google Sheets
        const sheets = google.sheets({ version: 'v4', auth });
        
        // Values to append
        const values = [
            [new Date().toISOString(), name, location, mobile, videoUrl]
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:E', // Assumes data is on "Sheet1" and uses 5 columns
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: values
            }
        });

        return res.status(200).json({ success: true, videoUrl });
    } catch (error) {
        console.error('Error saving data to Sheets:', error);
        return res.status(500).json({ error: error.message });
    }
}
