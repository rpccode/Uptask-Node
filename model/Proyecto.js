const sequelize = require('sequelize');
const db = require('../config/db.js');
const slug = require('slug');
const shortid = require('shortid');




const Proyectos = db.define('proyectos', {
    id: {
        type: sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: sequelize.STRING(100),
    },
    url: sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();


            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;