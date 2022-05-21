const { Sequelize } = require('sequelize');
//estraer valores de  variables.env 
require('dotenv').config({ path: 'variables.env' })

const db = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.DB_USER,
    process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        define: {
            timestamps: false,
        },
        pools: {
            max: 5,
            min: 5,
            acquire: 3000,
            idle: 10000
        }
    });
module.exports = db;