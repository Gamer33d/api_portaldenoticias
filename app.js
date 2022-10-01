const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')




const noticias = require('./routes/noticias')
const auth = require('./routes/auth')
const admin = require('./routes/admin')

require('./db/models/Noticia')
const Noticia = mongoose.model('noticia')

//MongoDB

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao mongodb')
}).catch((e) => {
    console.log('Erro: ' + e)
});


//Config
app.use(bodyParser.json())




//Cors
app.use((req, res, next) => {
    
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH")
    app.use(cors())
    next()
})

//Rotas

app.use('/', noticias)
app.use('/auth', auth)
app.use('/adm', admin)

const port = process.env.PORT || 8050
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
    
})