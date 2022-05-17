const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const about = new Schema({
    about: {
        type: String,
        required: true
    }
});

const About = new mongoose.model("about", about);
module.exports = About;
