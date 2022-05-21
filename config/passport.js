 const passport = require('passport')
 const localStrategy = require('passport-local');

 //Referencia al modelo donde se va a autenticar`
 const Usuarios = require('../model/Usuarios');


 //LOCAL STRATEGY - LOGINCON CREDENCIALES PROPIOS(USUARI PASSWORD)

 passport.use(new localStrategy({
         usernameField: 'email',
         passwordField: 'password',
     },
     async(email, password, done) => {
         try {
             const usuario = await Usuarios.findOne({ where: { email, activo: 1 } })
                 //el usuario existe password incorrecto
             if (!usuario.verificarPassword(password)) {
                 return done(null, false, {
                     message: 'Password Incorrecto',
                 })

             }
             //el email existe y el password es correcto
             return done(null, usuario);
         } catch (error) {
             //ese usuario no existe 

             return done(null, false, {
                 message: 'Esta Cuenta no existe'
             })

         }
     }
 ));


 //serializar el usuario
 passport.serializeUser((usuario, callback) => {
         callback(null, usuario);
     })
     //desserealizar el usuario
 passport.deserializeUser((usuario, callback) => {
     callback(null, usuario);
 })


 module.exports = passport;