// routes.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routers/routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use('/', userRoutes, (req, res) => {
    res.json({message: 'RESTful Api Backend using ExpressJS made by Mj Estepanie Palo.'});
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});