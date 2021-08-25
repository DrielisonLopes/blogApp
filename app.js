// Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
//const bodyParser = require('body-parser') bodyParser passou a ser do node sem precisar invocar
const path = require('path') // modulo para manipular pastas
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const admin = require('./routes/admin')

// Configurações
    // Sessão
    app.use(session.session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash()) //para configuar o flash() precisa estar em baixo da sessão
    // Middleware
    app.use((req, res, next) => {
        // usa locals. para guardar qualquer coisa nas variáveis globais
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })

    // Body Parser
    app.use(express.urlencoded({extended:true}))
    app.use(express.json());
    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
            console.log("Conectado com sucesso!")
        }).catch((err) =>{
            mongoose.Promise = global.Promise;
            console.log("Erro ao conectar: " + err)
        })

    // Public // a pasta que guarda todos nossos arquivos estaticos
    app.use(express.static(path.join(__dirname, 'public'))) // dirname para caminho absoluto
    
// Rotas
app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})