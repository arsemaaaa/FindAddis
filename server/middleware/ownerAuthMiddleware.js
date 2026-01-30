import jwt from 'jsonwebtoken'

const ownerAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1]; // "Bearer TOKEN"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.owner = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            restaurantsOwned: decoded.restaurantsOwned
        };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export default ownerAuthMiddleware;
