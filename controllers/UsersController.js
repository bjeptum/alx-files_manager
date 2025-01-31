import sha1 from 'sha1';
import dbClient from '../utils/db';

const postNew = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  try {
    const usersCollection = await dbClient.usersCollection();
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Already exists' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    const newUser = {
      email,
      password: hashedPassword,
    };

    // Insert new user into the 'users' collection
    const result = await usersCollection.insertOne(newUser);

    return res.status(201).json({
      id: result.insertedId,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default postNew;
