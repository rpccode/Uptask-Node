const Usuarios = require('../model/Usuarios');
const enviarEmail = require('../handlers/email');
exports.formCrearCuenta = (req, res, next) => {
    res.render('crearCuenta', {
        nombrePagina: "Crear Cuenta En Uptask",

    })
}
exports.formIniciarSession = (req, res, next) => {


    res.render('iniciarSession', {
        nombrePagina: "Inicia Session En Uptask",


    })
}

exports.crearCuenta = async(req, res, next) => {
    //leer los datos 
    const { email, password } = req.body;
    // crear el usuario

    try {
        await Usuarios.create({ email, password })

        //crear un url de confirmar el
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objecto de usuario
        const usuario = {

                email
            }
            //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu Cuenta Uptask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un Correo, confirma tu cuenta ')
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password
        })

    }

}

exports.formRestablecer = (req, res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer password'
    })
}

//cambia el estado de una cuenta 
exports.confirmarCuenta = async(req, res) => {
    const usuario = await Usuarios.findOne({ where: { email: req.params.email } })

    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1;

    await usuario.save();

    req.flash('correcto', 'Cuenta activada Correctamente');
    res.redirect('/iniciar-sesion');

}