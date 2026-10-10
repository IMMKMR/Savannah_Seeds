import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { filename, mimeType } = req.body || {};

        if (!filename || !mimeType) {
            return res.status(400).json({ error: 'Missing filename or mimeType' });
        }

        const S3 = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
        });

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME || 'covana',
            Key: filename,
            ContentType: mimeType,
        });

        const uploadUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
        
        // R2_PUBLIC_URL should be your R2.dev URL or custom domain, e.g. https://pub-xyz.r2.dev
        const publicUrl = process.env.R2_PUBLIC_URL 
            ? `${process.env.R2_PUBLIC_URL}/${filename}`
            : `https://YOUR_R2_PUBLIC_URL/${filename}`;

        return res.status(200).json({ uploadUrl, publicUrl, fileId: filename });
    } catch (error) {
        console.error('Error generating upload URL:', error);
        return res.status(500).json({ error: error.message });
    }
}
