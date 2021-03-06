const mongoose = require('mongoose')

const Cargo = new mongoose.Schema({
    cargo:{
        type: String,
        required: true
    },
    permissions:{
        type: Array,
        required: true
    }

},
{
    timestamps: true
})

mongoose.model('cargos', Cargo)