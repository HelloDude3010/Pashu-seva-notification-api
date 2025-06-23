const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Load Service Account Key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    "Hello": "World"
  })
})
// API endpoint to send notification
app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };
  console.log("1");
  try {
    const response = await admin.messaging().send(message);
    console.log("2");
    console.log('Successfully sent message:', response);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.log("3");
    console.error('Error sending message:', error);
    res.status(500).send({ success: false, error });
  }
});

// Start the server
const PORT = 5624;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
