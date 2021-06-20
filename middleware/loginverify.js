const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

function handleJWTToken(token)
{
    // Sanitize String
    return token.split(' ')[1];
}


exports.obrigatorio = (req, res, next) => {
    try {
        const token = handleJWTToken(req.headers.authorization);
        req.usuario = jwt.verify(token, process.env.JWT_TOKEN)

        next()
    } catch {
        return res.status(401).json({ error: true, message: "Falha na autenticação." })
    }
}
