const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

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
    } else {
        
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com este e-mail cadastrado")
                res.redirect("/usuarios/registro")
            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                // para criptografar a senha
                bcrypt.genSalt(10, (erro, salt) => {
                    if(erro){
                        req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
                        res.redirect("/")
                    }
                    // pega a senha do novo usuario e coloca na hash
                    novoUsuario.senha = hash
                    // agora salva o usuário
                    novoUsuario.save().then(() => {
                        req.flash("success_msg", "Usuário criado com sucesso!")
                        res.redirect("/")
                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!")
                        res.redirect("/usuarios/registro")
                    })
                    
                })
            }
        }).cath((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) =>{
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    // authenticate - sempre que for fazer autenticação
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})


module.exports = router