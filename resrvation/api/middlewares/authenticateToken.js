const jwt = require('jsonwebtoken');
const jwtSecret = 'dcbd5e32bhr78r49r845b';

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('Authenticated user:', user); // Log the authenticated user
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
