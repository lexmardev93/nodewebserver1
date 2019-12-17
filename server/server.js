//Este sera el primer archivo en ejcutar todo lo que contenga por estar en la primera linea
require('./config/config');

const express = require('express');
const app = express();

//Body parser
const bodyParser = require('body-parser');

//Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/usuarios', function(req, res) {
    res.json('Usuarios GET');
});

app.post('/usuarios', function(req, res) {
    let data = req.body;
    if (data.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            peticion: 'POST',
            coleccion: 'Usuarios',
            data
        });
    }
});

app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id,
        peticion: 'PUT',
        coleccion: 'Usuarios'
    });
});

app.delete('/usuarios', function(req, res) {
    res.json('Usuarios DELETE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${ process.env.PORT }`);
});