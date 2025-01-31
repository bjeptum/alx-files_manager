const Bull = require('bull');
const fs = require('fs');
const imageThumbnail = require('image-thumbnail');
const path = require('path');
const { getFileFromDB, saveThumbnailToDB } = require('./dbHelpers');

// Bull Queue Setup
const fileQueue = new Bull('fileQueue');

// Process the queue
fileQueue.process(async (job) => {
  const { userId, fileId, filePath } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  // Simulate getting file document from DB
  const fileDocument = await getFileFromDB(fileId, userId);

  if (!fileDocument) {
    throw new Error('File not found');
  }

  try {
    // Generate 3 thumbnails
    const sizes = [500, 250, 100];
    for (const size of sizes) {
      const thumbnailPath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}_${size}${path.extname(filePath)}`);

      const thumbnail = await imageThumbnail(filePath, { width: size });

      fs.writeFileSync(thumbnailPath, thumbnail);

      await saveThumbnailToDB(fileId, userId, thumbnailPath);
    }
  } catch (error) {
    throw new Error(`Error generating thumbnails: ${error.message}`);
  }

  return { status: 'completed' };
});
