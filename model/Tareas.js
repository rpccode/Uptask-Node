const sequelize = require('sequelize');
const db = require('../config/db');
const proyectos = require('./Proyecto');


const Tareas = db.define('tareas', {
    id: {
        type: sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: sequelize.STRING(100),
    estado: sequelize.BOOLEAN
});

Tareas.belongsTo(proyectos);

module.exports = Tareas;