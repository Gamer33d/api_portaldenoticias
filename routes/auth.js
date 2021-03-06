const express = require("express")
const router = express.Router()
require('dotenv').config()
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
const uniquid = require('uniqid')

require('../db/models/Users')
const Users = mongoose.model('users')

require('../db/models/Cargos')
const Cargos = mongoose.model('cargos')

const login = require('../middleware/loginverify')

const { Verify } = require('../classes/classes')


router.post('/signup', login.obrigatorio, async (req, res) => {
    var { email, senha, cargo, name } = req.body

    Users.findOne({ email: req.usuario.email }).then(async (conta) => {
        if (conta.banned) {
            res.status(401).json({ error: true, message: "Você está banido!" })
        } else {
            const verifypermissions = new Verify(null, null, req.usuario.permissions, 'createAccount')

            const result = verifypermissions.verifyPermissions()

            console.log(result)

            if (!email || !senha || !cargo) {
                return res.status(400).json({ error: true, message: "Esqueceu os valores de email, senha ou cargo" })
            } else if (!result) {
                return res.status(401).json({ error: true, message: "Voçê não tem permissão para criar contas" })
            } else {

                Cargos.findOne({ cargo: cargo }).then(async cargopro => {
                    if (cargopro == null || !cargopro) {
                        return res.status(404).json({ error: true, message: "Não existe esse cargo!" })
                    } else {
                        Users.findOne({ email: email }).then(async conta => {


                            if (conta != null || conta) {
                                return res.status(400).json({ error: true, message: "Ja existe usuario com esse email!" })
                            } else {
                                hashsenha = await bcrypt.hash(senha, 10)

                                if (!name) {
                                    name = 'anonimo-' + uniquid()
                                }

                                Users.create({ email: email, senha: hashsenha, cargo: cargo, name: name, banned: false }, (err) => {
                                    if (err) return res.status(400).json({ error: true, message: 'Vixi, deu erro, abaixo verá certinho o erro', err })

                                    return res.status(200).json({ error: false, message: "Conta criada com sucesso!" })
                                })
                            }
                        })
                    }
                })


            }

        }
    })


})

router.post('/login', async (req, res) => {
    var { email, senha } = req.body



    if (!email || !senha) {
        return res.status(404).json({ error: true, message: "Esqueceu os valores de email ou senha" })
    } else {
        Users.findOne({ email: email }).then(async (conta) => {
            if (!conta) {
                return res.status(401).json({ error: true, message: "Email Invalido!" })
            } else {
                Cargos.findOne({ cargo: conta.cargo }).then(async (c) => {



                    var isEqual = await bcrypt.compare(senha, conta.senha)


                    if (isEqual) {
                        const token = jwt.sign({
                            id: conta._id,
                            name: conta.name,
                            email: conta.email,
                            cargo: conta.cargo,
                            permissions: c.permissions
                        }, process.env.JWT_TOKEN,
                            {
                                expiresIn: "2h"
                            })


                        return res.status(200).json({ error: false, message: "Logado com sucesso!", token: token })


                    } else {
                        return res.status(401).json({ error: true, message: "Senha Invalida!" })
                    }
                })



            }


        })
    }







})





module.exports = router