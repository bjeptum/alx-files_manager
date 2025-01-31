import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

// API Routes
app.use(routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
