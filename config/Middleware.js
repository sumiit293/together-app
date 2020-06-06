
const jwt = require("jsonwebtoken")
const secret = require("./../config/MyUrl").secret

module.exports = (req, res, next) => {
    const userAuthToken = req.header('x-userAuth-token');

    if (!userAuthToken) {
        return res.status(401).json({ msg: "No token Authorization denied" })
    }

    try {
        const decoded = jwt.verify(userAuthToken, secret);
        req.id = decoded.id;
        console.log(decoded.id);
        next();

    } catch{

        res.status(401).json({ msg: "Token not valid" });

    }
}