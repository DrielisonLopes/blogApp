const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// para usar um model de forma externa
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

router.get('/categorias', (req, res) => {
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) =>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    }).catch((err) => {
        
    })
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug inválido"})
    }

    if (req.body.nome.length < 2) {
        erros.push({texto: "Nome da categoria é muito pequeno"})
    }

    if(erros.length > 0) {
        res.render("admin/addcategorias", {erros: erros})
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch(err => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id", (req, res) => {
    // fazer busca pelo id para poder fazer a alteração
    // utilizar params pq está trabalhando com parametros. Body seria para formulários
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria:categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({_id:req.body.id}).lean().then((categoria) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome==undefined || req.body.nome== null){
        erros.push({texto:'Nome inválido'})
    }
    if(!req.body.slug || typeof req.body.slug== undefined || req.body.slug== null){
        erros.push({texto: 'Slug inválido'})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome da categoria é muito curto'})
    }
    if(erros.length>0){
        res.render('admin/editcategorias', {categoria:categoria, erros:erros} )
    }else{

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno a edição da categoria")
            res.redirect("/admin/categorias")
        })

    }

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.post('/categorias/deletar/:id', (req,res) => {
    Categoria.findOneAndDelete({_id: req.params.id}).then(()=> {
        req.flash('success_msg','Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg','Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens', (req, res) => {

    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", (req, res) => {

    var erros = [];

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma catagoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro enquanto estava salvando a postagem")
            res.redirect("/admin/postagens")
        })
    }
})

module.exports = router