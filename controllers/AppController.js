import { MongoClient } from 'mongodb';
import redisClient from '../utils/redis';

const mongoClient = new MongoClient(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db;

mongoClient.connect()
  .then((client) => {
    db = client.db('myDatabase');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

export const getStatus = async (req, res) => {
  try {
    const redisStatus = redisClient.isAlive(); // Check if Redis is alive
    const dbStatus = !!db; // Check if DB is alive (simplified)

    res.status(200).json({ redis: redisStatus, db: dbStatus });
  } catch (err) {
    console.error('Error getting status', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    // Count the number of users and files in the database
    const usersCount = await db.collection('users').countDocuments();
    const filesCount = await db.collection('files').countDocuments();

    res.status(200).json({ users: usersCount, files: filesCount });
  } catch (err) {
    console.error('Error getting stats', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
