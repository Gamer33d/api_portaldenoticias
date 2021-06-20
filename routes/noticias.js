const express = require("express")
const router = express.Router()

const login = require('../middleware/loginverify')

const mongoose = require('mongoose')

require('dotenv').config()
require('../db/models/Noticia')

const Noticia = mongoose.model('noticia')

require('../db/models/Users')
const Users = mongoose.model('users')


const { Verify } = require('../classes/classes')


router.get('/', (req, res) => {
    Noticia.find({}).then((artigo) => {

        if (artigo.length == 0) {
            return res.status(200).json({ error: true, message: "Não existe nenhuma noticia cadastrada!" })
        }
        return res.status(200).json({ error: false, artigo })
    })
})

router.get('/:id', (req, res) => {
    Noticia.findOne({ _id: req.params.id }).then((artigo) => {
        if (artigo == null) {
            return res.status(404).json({ error: true, message: "Não foi encontrado nenhum artigo com o ID informado" })
        } else {
            return res.status(200).json({ error: false, artigo })
        }

    })
})

router.patch('/updateNews/:id', login.obrigatorio, (req, res) => {


    Noticia.findOne({ _id: req.params.id }).then((noticia) => {
        Users.findOne({ email: req.usuario.email }).then(async (account) => {
            if (account.banned) {
                res.status(401).json({ error: true, message: "Você está banido!" })
            } else {
                const verifypermission = new Verify(
                    noticia.emailcriador,
                    req.usuario.email,
                    req.usuario.permissions,
                    'updateNews'
                )
                const permission = verifypermission.verifyPermissions()

                if (permission) {
                    Noticia.updateOne({ _id: req.params.id }, req.body, (err) => {
                        if (err) return res.status(400).json({
                            error: true,
                            message: "Ocorreu um erro ao editar a notícia, verifique o id"
                        })

                        return res.status(200).json({
                            error: false,
                            message: "Noticia editada com sucesso"
                        })
                    })
                } else {
                    res.status(401).json({ error: true, message: "Sem permissão para editar essa noticia" })
                }
            }
        })
    }).catch(() => {
        return res.status(404).json({ error: true, message: "Id incorreto!" })
    })
})

router.delete('/deleteNews/:id', login.obrigatorio, (req, res) => {

    Noticia.findOne({ _id: req.params.id }).then(async (noticia) => {
        Users.findOne({ email: req.usuario.email }).then(async (account) => {

            if (account.banned) {
                res.status(401).json({ error: true, message: "Você está banido!" })
            } else {
                const verifypermission = new Verify(
                    noticia.emailcriador,
                    req.usuario.email,
                    req.usuario.permissions,
                    'deleteNews')

                const permission = await verifypermission.verifyPermissions()

                if (permission) {
                    Noticia.deleteOne({ _id: req.params.id }).then(() => {
                        return res.status(200).json({ error: false, message: 'Noticia deletada com sucesso' })
                    }).catch(err => {
                        return res.status(400).json({ error: true, message: 'Nao foi possivel deletar essa noticia, verifique o id' })
                    })
                } else {
                    res.status(401).json({ error: true, message: "Sem permissão para excluir essa noticia" })
                }
            }
        })
    }).catch((e) => {
        return res.status(404).json({ error: true, message: "Id incorreto!" })
    })
})

router.post('/postNews', login.obrigatorio, (req, res) => {

    var { title, conteudo } = req.body

    if (!title || !conteudo) {
        return res.status(404).json({ error: true, message: "Não encontramos o título ou o conteúdo da notícia" })
    } else {

        Users.findOne({ email: req.usuario.email }).then((account) => {
            if (account.banned) {
                res.status(401).json({ error: true, message: "Você está banido!" })
            } else {

                const payload = {
                    title: title,
                    conteudo: conteudo,
                    namecriador: req.usuario.name,
                    emailcriador: req.usuario.email
                }

                Noticia.create(payload, (err) => {

                    if (err) {
                        return res.status(400).json({
                            error: true,
                            message: err
                        })
                    } 

                    return res.status(200).json({
                        error: false,
                        message: 'Noticia Cadastrada com sucesso'
                    })
                })
            }
        })
    }
})
module.exports = router;