const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const login = require('../middleware/loginverify')


const Users = mongoose.model('users')
require('../db/models/Users')

const { Verify } = require('../classes/classes')
require('dotenv').config()


router.post('/banUser/:id', login.obrigatorio, (req, res) => {
    
    const verify = new Verify(null, null, req.usuario.permissions, 'banUser')

    const response = verify.verifyPermissions();

    if(response){
        Users.findOne({_id: req.params.id}).then((conta) => {
            
            if(conta.email == login.obrigatorio.email){
                return res.status(401).json({error: true, message: "Você nao pode se banir ou se desbanir"})
            }else{
                if(conta.banned){

                    Users.updateOne({_id: req.params.id}, {banned: false}, (err) => {
                        
                        if(err) return res.status(400).json({
                            error: true,
                            message: "Ocorreu um ao desbanir esse usuario!"
                        })

                        return res.status(200).json({error: false, message: "Usuario Desbanido"})
                    })
                    
                }else{
                    Users.updateOne({_id: req.params.id}, {banned: true}, (err) => {

                        if(err) return res.status(400).json({
                            error: true,
                            message: "Ocorreu um ao Banir esse usuario!"
                        })

                        return res.status(200).json({error: false, message: "Usuario Banido"})
                    })
                }
            }
        }).catch(() => {
            return res.status(404).json({error: true, message: "Id do usuario invalido!"})
        })

    }else{
        return res.status(401).json({error: true, message: "Você não tem permissão para banir usuarios"})
    }
})

module.exports = router