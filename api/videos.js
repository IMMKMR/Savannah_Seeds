import { getGoogleAuth, google } from './_google.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check Dashboard Password
    const authHeader = req.headers.authorization || '';
    if (authHeader !== process.env.DASHBOARD_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized. Incorrect password.' });
    }

    try {
        const auth = getGoogleAuth(['https://www.googleapis.com/auth/spreadsheets.readonly']);

        const sheets = google.sheets({ version: 'v4', auth });
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:E', 
        });

        const rows = response.data.values;
        
        if (!rows || rows.length <= 1) {
            return res.status(200).json([]);
        }

        // Skip the header row
        const dataRows = rows.slice(1);
        
        const videos = dataRows.map((row, index) => {
            return {
                id: index.toString(),
                createdAt: row[0] || new Date().toISOString(),
                name: row[1] || 'Unknown',
                location: row[2] || 'Unknown',
                mobile: row[3] || 'Unknown',
                videoUrl: row[4] || '', // Using Drive link for both
                driveLink: row[4] || '',
                syncedToDrive: true // Because it's already in Drive!
            };
        });

        // Return latest first
        videos.reverse();

        return res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos from Sheets:', error);
        return res.status(500).json({ error: error.message });
    }
}
