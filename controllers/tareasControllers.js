const Proyecto = require('../model/Proyecto');
const Tareas = require('../model/Tareas');
exports.formularioTareas = async(req, res, next) => {
    const proyecto = await Proyecto.findOne({ where: { url: req.params.url } });

    //Leer el valor del Input
    const { tarea } = req.body;
    //Estado 0 = a incompleto
    const estado = 0;
    //ID DEL PROYECTO
    const proyectoId = proyecto.id;

    const errores = [];

    //validar errores
    if (!tarea) {
        errores.push({ msg: "Agrege un Nombre a la Tarea" });
    }

    //insertar a la base de datos 
    const resultado = await Tareas.create({ tarea, estado, proyectoId });
    if (!resultado) {
        return next();
    }
    //redireccionar 
    res.redirect(`/proyectos/${req.params.url}`);


}

exports.cambiarEstadoTareas = async(req, res, next) => {
    const { id } = req.params;

    const tarea = await Tareas.findOne({ where: { id } });

    //cambiar el estado 
    let estado = false;
    if (tarea.estado === estado) {
        estado = true;
    }

    tarea.estado = estado;
    const resultado = await tarea.save();

    if (!resultado) {
        return next();
    }
    res.status(200).send('ACTUALIADO ');
}

exports.eliminarTareas = async(req, res, next) => {

    const { id } = req.params;

    //eliminar la tarea 
    const resultado = await Tareas.destroy({ where: { id } });

    if (!resultado) {
        return next();
    }


    res.status(200).send('Tarea Eliminada Correctamente')
}