const mongoose = require('mongoose')

const model = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    key:{
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: true
    },
    git_url: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model("Project", model)