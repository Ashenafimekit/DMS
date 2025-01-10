const jwt = require("jsonwebtoken");

const authMiddleware = (role = []) => (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ message: "no token, authorizaion denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) return res.status(403).json({ message: "Access denied" });

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is not valid" });
    }
  };

module.exports = authMiddleware;