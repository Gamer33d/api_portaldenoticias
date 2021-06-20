const mongoose = require('mongoose')

const Noticia = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    namecriador: {
        type: String
    },
    emailcriador: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

mongoose.model('noticia', Noticia)