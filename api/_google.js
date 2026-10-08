import { google } from 'googleapis';

/**
 * Shared Google auth for all API routes.
 * NOTE: google-auth-library v10+ only accepts an options object for JWT —
 * the old positional form `new JWT(email, null, key, scopes)` silently
 * produces an unauthenticated client.
 */
export function getGoogleAuth(scopes) {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (!email || !key) {
        throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY env variable');
    }

    return new google.auth.JWT({ email, key, scopes });
}

export { google };
