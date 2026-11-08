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
        });
    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};


module.exports = {
   registerUser,
   loginUser,
   logoutUser,
   userProfile,
};