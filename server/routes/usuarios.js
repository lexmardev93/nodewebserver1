const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificarToken, verificarRole } = require('../config/middlewares/autenticacion');
const app = express();

//Verificar token es el middleware que se va a disparar antes de ejecutar la peticion y continuara solo si el middleware lo permite
//con la funcion next()
app.get('/usuarios', verificarToken, (req, res) => {

    //Los parametros opcionales vienen en query
    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;

    // Se excluyen los campos que no queremos devolver
    Usuario.find({ estado: true }, '-password -estado -google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, cont) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                return res.json({
                    ok: true,
                    Total: cont,
                    usuarios
                });
            });
        });
});

app.post('/usuarios', [verificarToken, verificarRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, ususarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: ususarioDB
        });
    });
});

app.put('/usuarios/:id', [verificarToken, verificarRole], (req, res) => {
    let id = req.params.id;
    //recibimos solo las propiedades que queremos utilizando underscore
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Metodo que actuliza y con el new le decimos que nos devuelva el documento actualizado
    //useFindAndModify para evitar un warning
    // runValidators para correr las validaciones que estan en el esquema
    Usuario.findByIdAndUpdate(id, body, { new: true, useFindAndModify: false, runValidators: true }, (err, ususarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: ususarioDB
        });
    });
});

app.delete('/usuarios/:id', [verificarToken, verificarRole], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, useFindAndModify: false }, (err, ususarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: ususarioBorrado
        });
    });
});

module.exports = app // Ojo en esta exportacion

// Codigo para peticion get con mongoose paginate
//Haciendolo con mongoose paginate pero tiene warning de collection count document

// let pagina = Number(req.query.pagina) || 1;
// let itemsPagina = 10;

// Usuario.paginate({}, { page: pagina, limit: itemsPagina, sort: '_id' }, (err, usuarios) => {
//     if (err) {
//         return res.status(500).json({
//             ok: false,
//             status: 500,
//             mensaje: 'Error en el servidor'
//         });
//     }

//     if (!usuarios) {
//         return res.status(404).json({
//             ok: false,
//             status: 404,
//             mensaje: 'No se encontraron elementos'
//         });
//     }

//     res.json({
//         ok: true,
//         status: 200,
//         usuarios: usuarios.docs,
//         total: usuarios.total,
//         pagina: usuarios.page,
//         totalpaginas: usuarios.pages
//     });
// });

///////////////////////////////////////////////////////////////////////////////

//Codigo para eliminar un documento de la bd
//Elimina por completo el usuario de la db 

// Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//     if (err) {
//         return res.status(400).json({
//             ok: false,
//             err
//         });
//     }

//     if (!usuarioBorrado) {
//         return res.status(404).json({
//             ok: false,
//             status: 404,
//             Mensaje: `No existe un usuario con ese id: ${ id }`
//         });
//     }

//     res.json({
//         ok: true,
//         status: 200,
//         usuario: usuarioBorrado
//     });
// });