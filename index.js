const express = require("express");
const router = require('./routers');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./Config/passport');
//importar las varibles de entorno
require('dotenv').config({ path: 'variables.env' })

///helpers con algunas funciones
const helpers = require('./helpers');



//crear la conexiion a la base de datos
const db = require('./config/DB.js');

require('./model/Usuarios');
require('./model/Proyecto');
require('./model/Tareas');


db.sync()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.log(error))


//Creando una app de express
const app = express();
///servidor ypuerto
const port = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

//abilitando archivos publicos
app.use(express.static('public'));

//habitar pug
app.set('view engine', 'pug');

//habiliitando body parser
app.use(bodyParser.urlencoded({ extended: true }));



//agregando vistas en express
app.set('views', path.join(__dirname, './views'));

app.use(flash());

//session nos permiten navegar entre distintas paginas sin volver a autenticar
app.use(session({
    secret: 'Supersecreto',
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
//Middleware

//Pasar vardump a la aplicacion
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    res.locals.var_dump = helpers.vardump;

    res.locals.usuarios = {...req.user } || null;

    next();
});



app.use('/', router());

app.listen(port, HOST, () => { console.log(`servidor funcionando en el puerto: ${port} `) });