import express from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

console.log('Starting backend in ' + (isDevelopment ? 'development' : 'production') + ' mode');

const serviceAccountPath = isDevelopment
  ? './certs/madhub-app-firebase-adminsdk-p10dk-9e73c4834b'
  : '/etc/secrets/madhub-app-firebase-adminsdk-p10dk-9e73c4834b';

initializeApp({
  credential: cert(require(serviceAccountPath)),
});

const db = getFirestore();

const app = express();
const port = 8080;

// Add middleware for JSON parsing
app.use(express.json());

// Start the Express server
app.listen(port, () => { 
  
  console.log('Server started on port: ' + port);

});

app.get('/api', async (req, res) => {
  res.send('GET request received');
});

async function checkCred(uid) {
  try {
    const userCollection = db.collection('users');

    // Query the Firestore collection for the provided uid and token
    const userDoc = await userCollection.doc(uid).get();

    // If the document exists and the token matches, consider it valid
    if (userDoc.exists && userDoc.data()?.uid === uid) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking token:', error);
    return false; // Return false in case of an error
  }
}