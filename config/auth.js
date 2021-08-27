const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport){
    // para saber qual campo quer analisar, no caso: email
    passport.use(new localStrategy({usernameField: 'email', passwordField:"senha"}, (email, senha, done) => {
        // vai procurar um email igual o da autenticação
        Usuario.findOne({email: email}).lean().then((usuario) => {

            if(!usuario){
                // o done recebe 3 parametros:
                // 1- os dados da conta foi autenticada | null pq nenhuma foi autenticada
                // 2- se a autenticação foi bem sucedida
                // 3- e uma mensagem
                return done(null, false, {message: "Esta conta não existe"})
            }
            // para comparar a senha com a senha do usuario encontrado
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                // se as senhas batem ou não
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))
    // Para salvar os dados do usuario na sessão usamos as seguintes funções:
        // para passar os dados do usuario
        passport.serializeUser((usuario, done) => {
            done(null, usuario.id)
        })
        // para procurar o usuário pelo id
        passport.deserializeUser((id, done) => {
            Usuario.findById(id, (err, usuario) => {
                done(err, usuario)
            })
        })
}
