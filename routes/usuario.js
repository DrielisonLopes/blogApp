const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == indefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == indefined || req.body.email == null){
        erros.push({texto: "E-mail inválido"})
    }

    if(!req.body.senha || typeof req.body.senha == indefined || req.body.senha == null){
        erros.push({texto: "Senha inválida"})
    }

    if(req.body.senha.length < 4){
        erros.push({texto: "Senha com menos de 4 caracteres é inválida"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "A confirmação da senha está diferente"})
    }

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
        // erros.push({texto: "Nome inválido"})
    } else {

    }


})

module.exports = router