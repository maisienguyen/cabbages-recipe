const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const {
    registerUser,
    loginUser,
    logoutUser,
    userProfile
} = require("../controllers/userController");

router.get("/", (req, res) => {
    res.send("This is userRoutes");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/profile", authMiddleware,authMiddleware, userProfile);

module.exports = router;