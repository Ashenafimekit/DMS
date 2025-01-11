const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
     // console.log("no token provided")
      return res.status(401).json({ message: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) return res.status(403).json({ message: "Access denied" });

      // Check if the user's role is authorized
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied, insufficient role" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;
