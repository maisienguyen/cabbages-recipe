const User = require("../models/User");

const registerUser = async (req, res) => {
   const { username, password, confirmPassword } = req.body;


   try {
       if (!username || !password || !confirmPassword) {
           return res.status(400).json({ message: "All fields are required" });
       }


       const userExists = await User.findOne({ username });
       if (userExists) {
           return res.status(400).json({ message: "User already exists" });
       }
       if (password !== confirmPassword) {
           return res.status(400).json({ message: "Passwords do not match" });
       }


       const user = await User.create({
           username,
           password: password,
       });


module.exports = {
   registerUser,
};
