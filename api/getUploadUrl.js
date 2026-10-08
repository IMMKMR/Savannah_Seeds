import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { filename, mimeType } = req.body;
        
        if (!filename || !mimeType) {
            return res.status(400).json({ error: 'Missing filename or mimeType' });
        }

        const auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/drive.file']
        );

        const { token } = await auth.getAccessToken();

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Upload-Content-Type': mimeType
            },
            body: JSON.stringify({
                name: filename,
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
            })
        });

        const uploadUrl = response.headers.get('Location');

        if (!uploadUrl) {
            throw new Error('Failed to obtain upload URL from Google Drive');
        }

        return res.status(200).json({ uploadUrl });
    } catch (error) {
        console.error('Error generating upload URL:', error);
        return res.status(500).json({ error: error.message });
    }
}
