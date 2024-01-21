// routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const db = require('./db');
const { authenticateToken } = require('./middlewares');
const userRoutes = require('./userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// ... Your route handlers go here ...

app.get('/', (req, res) => {
    res.json({ message: 'Restful API Backend Using Express' });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});