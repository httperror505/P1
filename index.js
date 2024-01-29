// routes.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const actions = require('./routers/actions.js');
// const userRoutes = require('./routers/User_routes.js');
const roles = require('./routers/roles.js');
const User_routes = require('./routers/User_routes.js');
const indicator = require('./routers/indicator.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use('/', User_routes, roles,  indicator);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});