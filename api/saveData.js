import { getGoogleAuth, google } from './_google.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, location, mobile, publicUrl } = req.body || {};

        if (!publicUrl) {
            return res.status(400).json({ error: 'Missing publicUrl' });
        }

        const auth = getGoogleAuth(['https://www.googleapis.com/auth/spreadsheets']);
        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:E',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[new Date().toISOString(), name, location, mobile, publicUrl]],
            },
        });

        return res.status(200).json({ success: true, videoUrl: publicUrl });
    } catch (error) {
        console.error('Error saving data to Sheets:', error);
        return res.status(500).json({ error: error.message });
    }
}
