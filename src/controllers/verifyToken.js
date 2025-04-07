import jwt from "jsonwebtoken";
import pino from "pino"

const logger = pino()

const verifyToken = (req, res, next) => {
    let token
    
    if(req.cookies){
        token = req.cookies.authToken;
    }

    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = decoded;
        next();
    });
};

export default verifyToken;