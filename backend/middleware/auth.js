require('dotenv').config();
const jwt = require('jsonwebtoken');
 module.exports = (req, res, next) => {
     try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.auth = decodedToken.userId;
        if (req.body.userId && req.body.userId !== req.auth) {
            throw error
        } else {
            next();
        }
     } catch {
        res.status(401).json({
            error: new Error('Unauthentified')
        });
     }
 };