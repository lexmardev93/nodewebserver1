const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

//Login del usuario
app.post('/login', (req, res) => {
    let body = req.body;

    //Busca en la bd
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    mensaje: 'Correo o contraseña incorrecta'
                }
            });
        }

        //Compara las contraseñas
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(404).json({
                ok: false,
                err: {
                    mensaje: 'correo o Contraseña incorrecta'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            Usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;