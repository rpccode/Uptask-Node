const passport = require('passport');
const Usuarios = require('../model/Usuarios');
const { Sequelize } = require('sequelize');
const op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    // si el usuario esta  autenticado
    if (req.isAuthenticated()) {
        return next();
    }

    //si no esta autenticado
    return res.redirect('iniciar-sesion');
}
exports.cerrarSesion = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //al cerrar sesion nos lleva al login
    })
}

//GENERAR UN TOKEN SI USUARIO ES VALIIDO
exports.enviarToken = async(req, res) => {
    const { email } = req.body;
    //Verificar si el usuario existe 
    const usuario = await Usuarios.findOne({ where: { email } })

    if (!usuario) {
        req.flash('error', 'No existe el  usuario')
        res.render('restablecer', {
            nombrePagina: 'Restablecer password',
        })
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; //expiiracion del token 

    //guardarlos en la base de datos
    await usuario.save();

    //url de resect
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    //ENVIA EL CORREO CON EL TOKEN 
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecerPassword'
    });
    req.flash('correcto', 'Se envio Un Mensaje a tu Correo');
    res.redirect('/iniciar-sesion')
}
exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token } })

    //si no encuentra el usuario
    if (!usuario) {
        req.flash('error', 'No valido')
        res.render('restablecer', {
            nombrePagina: 'Restablecer password',
        })
    }

    res.render('resetPassword', {
        nombrePagina: 'Restablecer password'
    })

}

exports.resetPasswordForm = async(req, res) => {
    //verifica el token y la fecha de expiracion
    const usuario = await Usuarios.findOne({
            where: {
                token: req.params.token,
                expiracion: {
                    [op.gte]: Date.now()
                }
            }
        })
        //verifica si el usuario existe
    if (!usuario) {
        req.flash('error', 'No valido')
        res.render('restablecer', {
            nombrePagina: 'Restablecer password',
        })
    }
    if (req.body.confirPassword === req.body.password) {
        usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        usuario.token = null;
        usuario.expiracion = null;
        await usuario.save();
        req.flash('correcto', 'Password Modificado Correctamente');
        res.render('iniciarSession', {
            nombrePagina: 'Iniciar Session',
        })
    } else {
        req.flash('error', 'Los Password No Coinciden')
        res.render('restablecer', {
            nombrePagina: 'Restablecer password',
        })
    }


}