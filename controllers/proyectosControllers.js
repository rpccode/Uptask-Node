const Proyecto = require('../model/Proyecto')
const Tareas = require('../model/Tareas')

const slug = require('slug');
const res = require('express/lib/response');

exports.proyectosHome = async(req, res) => {
    const usuarioId = res.locals.usuarios.id
    const proyectos = await Proyecto.findAll({
        where: {
            usuarioId
        }
    });
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });

}

exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuarios.id
    const proyectos = await Proyecto.findAll({
        where: {
            usuarioId
        }
    });
    res.render('nuevoProyecto', {
        nombrePagina: "Nuevo Proyecto",
        proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {
    const usuarioId = res.locals.usuarios.id
    const proyectos = await Proyecto.findAll({
        where: {
            usuarioId
        }
    });
    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ msg: 'Agrega un Nompre Al Proyecto' });
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        try {
            const usuarioId = res.locals.usuarios.id
            await Proyecto.create({
                nombre,
                usuarioId

            });
            res.redirect('/');

        } catch (error) {
            errores.push({ msg: error.message });
        }
    }


}


exports.proyectoPorUrl = async(req, res, next) => {
    const usuarioId = res.locals.usuarios.id
    const proyectosPromises = await Proyecto.findAll({
        where: {
            usuarioId
        }
    });
    const proyectoPromises = Proyecto.findOne({ where: { url: req.params.url } });



    const [proyectos, proyecto] = await Promise.all([proyectosPromises, proyectoPromises]);

    //COnsultar los tareas del proyecto
    const tareas = await Tareas.findAll({ where: { proyectoId: proyecto.id } })

    if (!proyecto) return next();

    //render a  la vista
    res.render('tareas', {
        nombrePagina: "Tareas del Proyecto",
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async(req, res, next) => {
    const usuarioId = res.locals.usuarios.id
    const proyectosPromises = await Proyecto.findAll({
        where: {
            usuarioId
        }
    });
    const proyectoPromises = Proyecto.findOne({ where: { id: req.params.id } });


    const [proyectos, proyecto] = await Promise.all([proyectosPromises, proyectoPromises]);


    res.render('nuevoProyecto', {
        nombrePagina: "Editar Proyecto",
        proyectos,
        proyecto
    })
}


exports.actualizarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuarios.id
    const proyectos = await Proyecto.findAll({
        where: {
            usuarioId
        }
    });
    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ msg: 'Agrega un Nompre Al Proyecto' });
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Editar Proyecto',
            errores,
            proyectos
        })
    } else {
        try {

            await Proyecto.update({
                nombre: nombre
            }, { where: { id: req.params.id } });
            res.redirect('/');

        } catch (error) {
            errores.push({ msg: error.message });
        }
    }
}
exports.eliminarProyecto = async(req, res, next) => {
    const { urlProyecto } = req.query;

    const resultados = await Proyecto.destroy({ where: { url: urlProyecto } });

    if (!resultados) {
        return next();
    }

    res.status(200).send('Proyecto eliminado correctamente ');
}