const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Autenticacion de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

//Login del usuario con google
app.post('/google', async(req, res) => {
    // Obtenemos el token que viene en la peticion
    let token = req.body.idtoken;

    // Verificamos el token
    verify(token).then(data => {
        let googleUser = data;

        // Verificamos que no exista el mismo correo en la bd
        Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Si el usuario existe validamos como se creo
            if (usuarioDB) {
                // Usuario creado normal
                if (usuarioDB.google === false) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Use su usuario y contraseña creados'
                        }
                    });
                } else {
                    // Usuario creado con google renovamos su token local no el de google el que nosotros generamos
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        Usuario: usuarioDB,
                        token
                    });
                }
            } else {
                // El usuario no existe en la base de datos y lo creamos nuevo
                let usuario = new Usuario();
                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((err, usuarioDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        Usuario: usuarioDB,
                        token
                    });
                })
            }
        });
    }).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });
});

module.exports = app;