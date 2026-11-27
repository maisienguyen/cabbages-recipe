const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   username: {
       type: String,
       required: true,
       trim: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
   },
   password: {
       type: String,
       required: true,
   },
   avatar: {
        type: String,
        default: "",
   },
   displayName: {
    type: String,
    default: "",
    trim: true,
},
   bio: {
    type: String,
    default: "",
    trim: true,
},
   createdAt: {
    type: Date,
    default: new Date(new Date().getTime()),
   },
});

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
