const mongoose = require("mongoose");

const toySchema = new mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    info: {
        type: String,
        require:true
    },
    category: {
        type: String,
        require:true
    },
    img_url: {
        type: String,
    },
    price: {
        type: Number,
        require:true
    },
    date_created: {
        type: Date
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

const Toy=mongoose.model("Toy",toySchema);
module.exports.Toy=Toy;
