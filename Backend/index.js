const express = require('express');
const dotenv = require('dotenv');

const vision = require('@google-cloud/vision');
const { getStorage, ref, listAll } = require("firebase/storage");
const { fbApp } = require('./firebase');

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

console.log('Starting backend in ' + (isDevelopment ? 'development' : 'production') + ' mode');

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

  ocr('test');

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

async function ocr(directory) {
  console.log('ocr called');
  const storage = getStorage(fbApp);

  // Create a reference under which you want to list
  const listRef = ref(storage, directory);

  // Find all the prefixes and items.
  listAll(listRef)
    .then((res) => {
      res.items.forEach((itemRef) => {
        console.log(itemRef);
      });
    }).catch((error) => {
      console.log("err");
      // Uh-oh, an error occurred!
    });

  /*
  const bucketName = 'madhub-app.appspot.com';
  const fileName = 'path/to/image.png';

  const client = new vision.ImageAnnotatorClient();
  
  const [result] = await client.documentTextDetection(
    `gs://${bucketName}/${fileName}`
  );

  const fullTextAnnotation = result.fullTextAnnotation;
  console.log(fullTextAnnotation.text);*/
}