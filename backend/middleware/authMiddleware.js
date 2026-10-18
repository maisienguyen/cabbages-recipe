const jwt = require("jsonwebtoken");
const user = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await user.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

module.exports = authMiddleware;