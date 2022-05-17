const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const Contacts = new mongoose.model("contact", contact);
module.exports = Contacts;
