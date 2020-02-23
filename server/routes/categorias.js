const express = require('express');
const _ = require('underscore');
const { verificarToken, verificarRole } = require('../config/middlewares/autenticacion');
const app = express();

// Importamos el modelo
let Categoria = require('../models/categoria');

app.get('/categorias', verificarToken, (req, res) => {
    // Para obtener todas las categorias
    Categoria.find({})
        .sort('descripcion') // para ordenar los elementos
        .populate('usuario', 'nombre email') // El populate revisa que objects id hay disponibles para cargar la informacion // el segundo paramentro son las propiedades que queremos que muestre
        .exec((err, categorias) => {
            // En caso de error de base de datos
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, cont) => {
                // En caso de error de base de datos
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    total: cont,
                    categorias
                });
            });
        });
});

// Obtener por id
app.get('/categorias/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        // En caso de error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // En caso que no encuentre el registro en la BD
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});


// Crear nueva categoria
app.post('/categorias', verificarToken, (req, res) => {
    // Obtenemos los datos
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        // En caso de error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // En caso que no se cree el registro en la BD
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualizar categoria

app.put('/categorias/:id', verificarToken, (req, res) => {
    let id = req.params.id; // Obtenemos el id
    let body = _.pick(req.body, ['descripcion']); // tomamos unicamente los valores que nos interesan

    // Agregar el context query para que acepte el unique validator del schema por que hay referencia a otra coleccion
    Categoria.findByIdAndUpdate(id, body, { new: true, useFindAndModify: false, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        // En caso de error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // En caso que no se modifique el registro en la BD
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Eliminar una categoria
app.delete('/categorias/:id', [verificarToken, verificarRole], (req, res) => {
    // Solo administrador puede borrar
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        // En caso de error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // En caso que no se elimine el registro en la BD
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        return res.json({
            ok: true,
            message: 'Categoria borrada con id: ' + id
        });
    });
});

// Exportamos la app
module.exports = app;