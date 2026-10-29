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
           return res.status(400).json({ message: "All fields are required" });
       }


       const user = await User.findOne({ username });


       if (!user) {
           return res.status(400).json({ message: "User doesn't exist" });
       }


       const isMatch = await bcrypt.compare(password, user.password);


       if (!isMatch) {
           return res.status(400).json({ message: "Invalid password" });
       }


       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
           expiresIn: "1d",
       });


       res.cookie("jwt", token, {
           httpOnly: false,
           expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
           sameSite: "none",
           secure: true,
       });


       res.status(200).json({
           id: user._id,
           message: "Logged in sucessful",
       });
   } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Internal server error" });
   }
};

const logoutUser = async (req, res) => {
   try {
       res.cookie("jwt", "", {
           httpOnly: false,
           secure: true,
           sameSite: "none",
           expires: new Date(0),
       });
       res.status(200).json({ message: "Logged out successfully" });
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
};


const userProfile = async (req, res) => {
   try {
       const token =
    req.headers.authorization?.split(" ")[1] ||
    req.cookies?.jwt;

if (!token) {
    return res.status(401).json({ message: "No token provided" });
}

       const decoded = jwt.decode(token, process.env.JWT_SECRET);
       if (!decoded) {
           return res.status(401).json({ message: "Invalid token" });
       }
       const { id } = decoded;


       const user = await User.findById(id);
       if (!user) {
           return res.status(404).json({ message: "User not found" });
       }


       res.status(200).json({
           id: user._id,
           username: user.username,
       });
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
};


module.exports = {
   registerUser,
   loginUser,
   logoutUser,
   userProfile,
};