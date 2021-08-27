module.exports = {
    eAdmin: function(req, res, next){
        // function isAuthenticated serve para verificar autenticação do usuario
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash("error_msg", "Você precisa ser Admin!")
        res.redirect("/")
    }
}
