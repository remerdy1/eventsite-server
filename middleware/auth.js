const jwt = require("jsonwebtoken");

// Authenticate tokens
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) res.status(401).send();

    try {
        const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        return next();
    } catch (e) {
        return res.sendStatus(403);
    }

    /*     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
        });
        return next(); */
}

module.exports = authenticateToken;