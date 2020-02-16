//Este sera el primer archivo en ejcutar todo lo que contenga por estar en la primera linea
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Esto es un paquete de node para el uso de path

const app = express();

//Body parser para recibir los datos post put
const bodyParser = require('body-parser');

//Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//Rutas de la api
app.use(require('./routes/index'));
// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(
        () => console.log('Conectado a mongodb'),
        err => { console.log('Error al conectar mongo ', err); });

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${ process.env.PORT }`);
});