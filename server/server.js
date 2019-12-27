//Este sera el primer archivo en ejcutar todo lo que contenga por estar en la primera linea
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Body parser
const bodyParser = require('body-parser');

//Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuarios'));

mongoose.connect(process.env.URL_DB + '&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(
        () => console.log('Conectado a mongodb'),
        err => { console.log('Error al conectar mongo ', err); });

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${ process.env.PORT }`);
});