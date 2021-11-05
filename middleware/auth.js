const jwt = require("jsonwebtoken");

// Authenticate tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) res.status(401).send();


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
    });
    return next();
}

module.exports = authenticateToken;