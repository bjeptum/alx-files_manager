import routes from './routes/index';

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

// API Routes
app.use(express.json());
app.use(routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
