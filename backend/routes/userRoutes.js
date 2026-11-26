const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    registerUser,
    loginUser,
    logoutUser,
    userProfile,
    updateUserProfile,
    changePassword,
    uploadAvatar,
} = require("../controllers/userController");

router.get("/", (req, res) => {
    res.send("This is userRoutes");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/profile", authMiddleware, userProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/change-password", authMiddleware, changePassword);

router.post(
    "/profile/avatar",
    authMiddleware,
    upload.single("avatar"),
    uploadAvatar
);

module.exports = router;