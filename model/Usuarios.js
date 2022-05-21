const sequelize = require('sequelize');
const db = require('../config/db');
const proyectos = require('./Proyecto');
const bcrypt = require('bcrypt-nodejs');


const Usuarios = db.define('usuarios', {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: sequelize.STRING(60),
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'Agrega un Correo Valido'
                },
                notEmpty: {
                    msg: 'EL Email no puede ir vacio'
                }
            },
            unique: {
                args: true,
                msg: 'Usuario Ya Registrado'
            }

        },
        password: {
            type: sequelize.STRING(),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'EL Password no puede ir vacio'
                }
            }
        },
        activo: {
            type: sequelize.INTEGER,
            defaultValue: 0
        },
        token: sequelize.STRING,
        expiracion: sequelize.DATE
    }, {
        hooks: {
            beforeCreate(Usuario) {
                Usuario.password = bcrypt.hashSync(Usuario.password, bcrypt.genSaltSync(10));
            }
        }
    }



);
//metodos perosnaliizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}
Usuarios.hasMany(proyectos);

module.exports = Usuarios;