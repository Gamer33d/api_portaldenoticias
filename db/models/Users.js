const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true 
    },
    cargo: {
        type: String,
        required: true
    },
    banned: {
        type: Boolean,
        required: true
    }
},
{
    timestamps: true
})

mongoose.model('users', User)