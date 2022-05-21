const nodeMailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');


let transport = nodeMailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass
        }
    })
    //generar html
const generarHTML = (archivo, options = {}) => {
    const HTML = pug.renderFile(`${__dirname}/../views/email/${archivo}.pug`, options);
    return juice(HTML);
}

exports.enviar = async(opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.htmlToText(html);
    let info = {
        from: '"UpTask 👻" <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text, // plain text body
        html // html body
    };
    const enviarEmail = util.promisify(transport.sendMail, transport);

    return enviarEmail.call(transport, info);
}