// middlewares.js
const jwt = require('jsonwebtoken');
const secretKey = "mj";

function authenticateToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'unauthorized' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'forbidden' });
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken,secretKey };