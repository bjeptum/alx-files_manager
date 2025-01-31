const express = require('express');
const Bull = require('bull');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const imageThumbnail = require('image-thumbnail');
const { getFileFromDB, saveThumbnailToDB } = require('./dbHelpers'); n

const app = express();
app.use(bodyParser.json());

// Bull Queue Setup
const fileQueue = new Bull('fileQueue');

app.post('/files', (req, res) => {
  const { userId, fileId, filePath } = req.body;

  if (!userId || !fileId || !filePath) {
    return res.status(400).json({ error: 'Missing userId, fileId, or filePath' });
  }

  fileQueue.add({ userId, fileId, filePath });

  // Simulating file being stored in the DB (this can be customized as needed)
  res.status(200).json({ message: 'File uploaded and processing started' });
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
