const express = require("express");
const proyectosControllers = require("../controllers/proyectosControllers.js");
const tareasControllers = require("../controllers/tareasControllers");
const usuarioControllers = require("../controllers/usuarioControllers");
const authControllers = require("../controllers/authControllers");



const { body } = require("express-validator/check");

const router = express.Router();


module.exports = function() {
    router.get('/',
        authControllers.usuarioAutenticado,
        proyectosControllers.proyectosHome);

    router.get('/nuevo-proyecto',
        authControllers.usuarioAutenticado,
        proyectosControllers.formularioProyecto);

    router.post('/nuevo-proyecto',
        authControllers.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosControllers.nuevoProyecto);

    //Listar proyectos
    router.get('/proyectos/:url',
        authControllers.usuarioAutenticado,
        proyectosControllers.proyectoPorUrl);

    //actualizar proyectos
    router.get('/proyectos/editar/:id',
        authControllers.usuarioAutenticado,
        proyectosControllers.formularioEditar);

    router.post('/nuevo-proyecto/:id',
        authControllers.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosControllers.actualizarProyecto);
    //eliiminar proyectos
    router.delete('/proyectos/:url',
        authControllers.usuarioAutenticado,
        proyectosControllers.eliminarProyecto);
    //Agregar Tarea 
    router.post('/proyectos/:url',
        authControllers.usuarioAutenticado,
        tareasControllers.formularioTareas);
    //cambiar estado
    router.patch('/tareas/:id',
        authControllers.usuarioAutenticado,
        tareasControllers.cambiarEstadoTareas);
    //eliminar tareas
    router.delete('/tareas/:id',
        authControllers.usuarioAutenticado,
        tareasControllers.eliminarTareas);
    //Crear nueva cuenta 
    router.get('/crear-cuenta', usuarioControllers.formCrearCuenta);
    router.post('/crear-cuenta', usuarioControllers.crearCuenta);
    router.get('/confirmar/:email', usuarioControllers.confirmarCuenta)
        //inicio de session
    router.get('/iniciar-sesion', usuarioControllers.formIniciarSession);
    router.post('/iniciar-sesion', authControllers.autenticarUsuario);
    router.get('/cerrar-sesion', authControllers.cerrarSesion);
    //Restablecer Password
    router.get('/restablecer', usuarioControllers.formRestablecer);
    router.post('/restablecer', authControllers.enviarToken);
    router.get('/restablecer/:token', authControllers.validarToken);
    router.post('/restablecer/:token', authControllers.resetPasswordForm);


    return router;

}