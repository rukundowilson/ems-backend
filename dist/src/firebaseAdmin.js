import dotenv from 'dotenv';
import admin from 'firebase-admin';
dotenv.config();
// Prefer passing a JSON service account in the env var FIREBASE_SERVICE_ACCOUNT
// or set GOOGLE_APPLICATION_CREDENTIALS to a service account file path.
const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!admin.apps.length) {
    if (serviceAccountEnv) {
        try {
            const serviceAccount = JSON.parse(serviceAccountEnv);
            admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        }
        catch (err) {
            console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT, falling back to application default credentials');
            admin.initializeApp();
        }
    }
    else {
        // If GOOGLE_APPLICATION_CREDENTIALS is set, admin.initializeApp() will use it.
        try {
            admin.initializeApp();
        }
        catch (err) {
            console.warn('Firebase admin not initialized. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.');
        }
    }
}
export const firebaseAdmin = admin;
export const auth = admin.auth();
//# sourceMappingURL=firebaseAdmin.js.map