const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   username: {
       type: String,
       required: true,
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
   createdAt: {
       type: Date,
       default: new Date(new Date().getTime()),
   },
});


module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
