const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    email: {
        type: String,
        unique: true,
        require:true
    },
    password: {
        type: String,
        require:true
    },
    passwordConfirm: {
        type: String,
        require:true
    },
    date_created: {
        type: Date,
        require:true
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    }
});
const User = mongoose.model("User", userSchema);
module.exports.User = User;