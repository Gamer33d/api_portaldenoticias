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
            return res.status(200).json({ error: true, message: "Não tem nenhuma noticia cadastrada!" })
        }
        return res.status(200).json({ error: false, artigo })
    })
})

router.get('/:id', (req, res) => {
    Noticia.findOne({ _id: req.params.id }).then((artigo) => {
        if (artigo == null) {
            return res.status(404).json({ error: true, message: "Nenhum artigo com esse id encontrado" })
        } else {
            return res.status(200).json({ error: false, artigo })
        }

    })
})

router.patch('/updatenoticia/:id', login.obrigatorio, (req, res) => {


    Noticia.findOne({ _id: req.params.id }).then((noticia) => {
        Users.findOne({ email: req.usuario.email }).then(async (conta) => {
            if (conta.banned) {
                res.status(401).json({ error: true, message: "Você está banido!" })
            } else {

                const verifypermission = new Verify(
                    noticia.emailcriador,
                    req.usuario.email,
                    req.usuario.permissions,
                    'updateNews'

                )

                const result = verifypermission.verifyPermissions()

                if (result) {
                    const noticia1 = Noticia.updateOne({ _id: req.params.id }, req.body, (err) => {
                        if (err) return res.status(400).json({
                            error: true,
                            message: "Ocorreu um erro ao editar essa noticia, verifique o id"
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

router.delete('/deletenoticia/:id', login.obrigatorio, (req, res) => {


    Noticia.findOne({ _id: req.params.id }).then(async (noticia) => {

        Users.findOne({ email: req.usuario.email }).then(async (conta) => {
            if (conta.banned) {
                res.status(401).json({ error: true, message: "Você está banido!" })
            } else {
                const verifypermission = new Verify(
                    noticia.emailcriador,
                    req.usuario.email,
                    req.usuario.permissions,
                    'deleteNews')

                const result = await verifypermission.verifyPermissions()



                if (result) {
                    const noticia = Noticia.deleteOne({ _id: req.params.id }).then(() => {
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
        console.log(e)
        return res.status(404).json({ error: true, message: "Id incorreto!" })
    })




})

router.post('/cadnoticia', login.obrigatorio, (req, res) => {


    var { title, conteudo } = req.body


    if (!title || !conteudo) {
        return res.status(404).json({ error: true, message: "Não encontramos o title ou o conteudo da noticia" })
    } else {

        Users.findOne({ email: req.usuario.email }).then((conta) => {
            if (conta.banned) {
                res.status(401).json({ error: true, message: "Você está banido!" })
            } else {

                const noticia = Noticia.create({ title: title, conteudo: conteudo, namecriador: req.usuario.name, emailcriador: req.usuario.email }, (err) => {
                    if (err) return res.status(400).json({
                        error: true,
                        message: err
                    })

                    return res.status(200).json({
                        error: false,
                        message: 'Noticia Cadastrada'
                    })
                })
            }



        })



    }



})



module.exports = router