// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
});

exports.getCredential = functions.https.onRequest(async (req, res) => {
  const {
    linkedinID,
    firstName,
    lastName,
    email,
    accessToken,
  } = req.body;
  // The UID we'll assign to the user.
  const uid = `linkedin:${linkedinID}`;

  // Save the access token tot he Firebase Realtime Database.
  const databaseTask = admin.database().ref(`/linkedInAccessToken/${uid}`).set(accessToken);

  // Create or update the user account.
  const userCreationTask = admin.auth().updateUser(uid, {
    displayName: firstName + ' ' + lastName,
    email,
    emailVerified: true
  }).catch((error) => {
    // If user does not exists we create it.
    if (error.code === 'auth/user-not-found') {
      return admin.auth().createUser({
        uid: uid,
        displayName: firstName + ' ' + lastName,
        email: email,
        emailVerified: true,
        createAt: new Date(),
      });
    }
  });
  try {
    // Wait for all async task to complete then generate and return a custom auth token.
    await Promise.all([userCreationTask, databaseTask]);
    // Create a Firebase custom auth token.
    const token = await admin.auth().createCustomToken(uid);
    res.send({token});
  } catch (error) {
    res.send(error);
  }
});