const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
const { username, email, password, confirmPassword } = req.body;
const normalizedUsername = username.trim();
const normalizedEmail = email.trim().toLowerCase();

   try {
       if (!username || !password || !confirmPassword) {
           return res.status(400).json({ message: "All fields are required" });
       }

       console.log("1. Register request received");
       const userExists = await User.findOne({
        $or: [
            { username: normalizedUsername },
            { email: normalizedEmail },
        ],
    });
       console.log("2. User check completed");

       if (userExists) {
           return res.status(400).json({ message: "Username or email already exists" });
       }
       if (password !== confirmPassword) {
           return res.status(400).json({ message: "Passwords do not match" });
       }
       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({
            message: "Please enter a valid email address",
        });
    }

       const salt = await bcrypt.genSalt(10);
       console.log("3. Salt generated");

       const hashedPassword = await bcrypt.hash(password, salt);
       console.log("4. Password hashed");

       const user = await User.create({
           username: normalizedUsername,
           email: normalizedEmail,
           password: hashedPassword,
       });
       console.log("5. User created");

    
 res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
       }); 
    } catch (error){
        console.error("Register error:", error);

    if (error.code === 11000) {
        return res.status(409).json({
            message: "Username or email already exists",
        });
    }

    return res.status(500).json({
        message: "Internal server error",
    });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                message: "User doesn't exist",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: false,
            path: "/",
        });

        return res.status(200).json({
            id: user._id,
            username: user.username,
            message: "Logged in successfully",
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const logoutUser = async (req, res) => {
   try {
       res.clearCookie("jwt", {
           httpOnly: true,
           secure: false,
           sameSite: "lax",
           path: "/",
       });
       return res.status(200).json({ message: "Logged out successfully" });
   } catch (error) {
       console.error("Logout error:", error);
       return res.status(500).json({
              message: "Internal server error",
       })
   }
};

const userProfile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar || "",
        });
    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const { username, email, avatar } = req.body;

        if (username !== undefined) {
            if (!username.trim()) {
                return res.status(400).json({
                    message: "Username cannot be empty",
                });
            }

            user.username = username.trim();
        }

        if (email !== undefined) {
            const normalizedEmail = email.trim().toLowerCase();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
                return res.status(400).json({
                    message: "Please enter a valid email address",
                });
            }

            const emailExists = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: user._id },
            });

            if (emailExists) {
                return res.status(409).json({
                    message: "Email already exists",
                });
            }

            user.email = normalizedEmail;
        }

        if (avatar !== undefined) {
            user.avatar = avatar;
        }

        await user.save();

        return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            message: "Profile updated successfully",
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New passwords do not match",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}; 


const uploadAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image",
            });
        }

        user.avatar = `/uploads/${req.file.filename}`;

        await user.save();

        return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            message: "Avatar uploaded successfully",
        });

    } catch (error) {
        console.error("Upload avatar error:", error);

        return res.status(500).json({
            message: "Failed to upload avatar",
        });
    }
};

module.exports = {
   registerUser,
   loginUser,
   logoutUser,
   userProfile,
   updateUserProfile,
   changePassword,
   uploadAvatar,
};