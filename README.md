# College Memories Website

A premium React/Next.js application for celebrating college memories.

## Firebase Security Rules

To ensure your website works correctly, you must set up the following security rules in your Firebase Console.

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: Open for testing. Secure this for production.
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // WARNING: Open for testing. Secure this for production.
    }
  }
}
```

## Setup
1. Environment variables are already set in `.env.local`.
2. Run `npm install`.
3. Run `npm run dev`.
