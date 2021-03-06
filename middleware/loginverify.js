const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')



exports.obrigatorio = (req, res, next) => {


    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_TOKEN)
        req.usuario =  decode

        
        
        


        next()
    } catch {
        return res.status(401).json({ error: true, message: "Falha na autenticação" })
    }
}
