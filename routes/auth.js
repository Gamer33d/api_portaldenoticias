const express = require("express")
require('dotenv').config()
const router = express.Router()
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

    Users.findOne({ email: req.usuario.email }).then(async (account) => {

        if (account.banned) {
            res.status(401).json({ error: true, message: "Você está banido!" })
        } else {
            const verifypermissions = new Verify(null, null, req.usuario.permissions, 'createAccount')

            const result = verifypermissions.verifyPermissions()

            if (!email || !senha || !cargo) {
                return res.status(400).json({ error: true, message: "Esqueceu os valores de email, senha ou cargo" })
            } else if (!result) {
                return res.status(401).json({ error: true, message: "Voçê não tem permissão para criar contas" })
            } else {

                Cargos.findOne({ cargo: cargo }).then(async cargopro => {
                    if (cargopro == null || !cargopro) {
                        return res.status(404).json({ error: true, message: "Não existe esse cargo!" })
                    } else {
                        Users.findOne({ email: email }).then(async account => {
                            if (account != null || account) {
                                return res.status(400).json({ error: true, message: "Ja existe usuario com esse email!" })
                            } else {
                                hashsenha = await bcrypt.hash(senha, 10)

                                if (!name) {
                                    name = 'anonimo-' + uniquid()
                                }

                                Users.create({ email: email, senha: hashsenha, cargo: cargo, name: name, banned: false }, (err) => {
                                    if (err) return res.status(400).json({ error: true, message: 'An error occurred while registering', err })

                                    return res.status(200).json({ error: false, message: "Account created successfully" })
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

    //Credentials
    var { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({ error: true, message: "Email and Password Must be filled." })
    } else {
        Users.findOne({ email: email }).then(async (account) => {

            if (!account) {
                return res.status(401).json({ error: true, message: "Email not Found." })
            } else {
                Cargos.findOne({ cargo: account.cargo }).then(async (role) => {

                    var validatePassword = await bcrypt.compare(password, account.senha)

                    if (validatePassword) {
                        const token = jwt.sign({
                            id: account._id,
                            name: account.name,
                            email: account.email,
                            cargo: account.cargo,
                            permissions: role.permissions
                        }, process.env.JWT_TOKEN,
                            {
                                expiresIn: "2h"
                            })

                        return res.status(200).json({ error: false, message: "Successfully logged in.", token: token })

                    } else {
                        return res.status(401).json({ error: true, message: "Password Invalid." })
                    }
                })
            }
        })
    }
})

module.exports = router