const express = require('express');
const _ = require('underscore');
const { verificarToken } = require('../middlewares/autenticacion');
const app = express();
//Modelo
let Producto = require('../models/producto');

// Obtener todos paginados
app.get('/productos', verificarToken, (req, res) => {
    //Los parametros opcionales vienen en query
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, cont) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    total: cont,
                    productos
                });
            });
        });
});

// Obtener por id
app.get('/productos/:id', verificarToken, (req, res) => {
    //Obtenemos el id
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Puede que sea un id incorrecto
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// Buscar
app.get('/productos/buscar/:busqueda', verificarToken, (req, res) => {
    let busqueda = req.params.busqueda;

    let regex = new RegExp(busqueda, 'i'); // Crea una expresion regular y con i le decimos que no sea case sensitive

    //Condicion or en la busqueda
    Producto.find({ $or: [{ nombre: regex }, { descripcion: regex }], disponible: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos
            });
        });
});

// Crear nuevo
app.post('/productos', verificarToken, (req, res) => {
    // Obtenemos los datos del body
    let body = _.pick(req.body, ['nombre', 'precio', 'descripcion', 'categoria']);
    // Obtenemos el id del usuario
    body.usuario = req.usuario._id;

    let producto = new Producto(body);

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// Actualizar
app.put('/productos/:id', verificarToken, (req, res) => {
    //Obtenemos el id
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precio', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, useFindAndModify: false, runValidators: true }, (err, productoDB) => {
        // En caso de error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // En caso que no se modifique el registro en la BD
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// Eliminar
app.delete('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, useFindAndModify: false, runValidators: true }, (err, productoDB) => {
        // En caso de error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // En caso que no se modifique el registro en la BD
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;