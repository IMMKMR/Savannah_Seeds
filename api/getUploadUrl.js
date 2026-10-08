import { getGoogleAuth } from './_google.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { filename, mimeType } = req.body || {};

        if (!filename || !mimeType) {
            return res.status(400).json({ error: 'Missing filename or mimeType' });
        }

        const auth = getGoogleAuth(['https://www.googleapis.com/auth/drive']);
        const { token } = await auth.getAccessToken();

        // supportsAllDrives=true is required to upload into a Shared Drive folder
        const response = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Upload-Content-Type': mimeType,
                    // Google ties CORS of the resumable session to this Origin,
                    // so the browser is allowed to PUT the video directly.
                    ...(req.headers.origin ? { 'Origin': req.headers.origin } : {}),
                },
                body: JSON.stringify({
                    name: filename,
                    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Drive session failed (${response.status}): ${errText}`);
        }

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
