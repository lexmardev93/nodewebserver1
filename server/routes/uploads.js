const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// Middleware
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No hay ningun archivo selccionado'
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                tipo: tipo
            }
        });
    }


    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    // Validar extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones de archivo permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar nombre al archivo
    let finalNombreArchivo = `${id}-${ new Date().getTime()}.${extension}`;


    // Injectamos el nombre del archivo com template literales
    archivo.mv(`uploads/${tipo}/${finalNombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo subir la imagen',
                err
            });
        }
        // Aqui la imagen ya esta en el servidor
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, finalNombreArchivo);
        } else {
            imagenProducto(id, res, finalNombreArchivo);
        }
    });
});

function imagenUsuario(id, res, imagen) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarImagen(imagen, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarImagen(imagen, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        let imagenAnterior = usuarioDB.img;

        usuarioDB.img = imagen;

        usuarioDB.save((err, usuarioActualizado) => {
            if (err) {
                borrarImagen(imagen, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioActualizado) {
                borrarImagen(imagen, 'usuarios');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario no existe'
                    }
                });
            }

            borrarImagen(imagenAnterior, 'usuarios');

            return res.json({
                ok: true,
                usuarioActualizado
            });
        });
    });
}

function imagenProducto(id, res, imagen) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarImagen(imagen, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarImagen(imagen, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        let imagenAnterior = productoDB.img;

        productoDB.img = imagen;

        productoDB.save((err, productoActualizado) => {
            if (err) {
                borrarImagen(imagen, 'productos');
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoActualizado) {
                borrarImagen(imagen, 'productos');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario no existe'
                    }
                });
            }

            borrarImagen(imagenAnterior, 'productos');

            return res.json({
                ok: true,
                productoActualizado
            });
        });
    });
}

function borrarImagen(imagen, tipo) {
    // Crea el paht hacia la imagen
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);

    // Evalua si existe un archivo en esa ruta
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen); // si existe lo borra
    } // Este metodo es sincrono ya que debemos de esperar a que se realice el borrado antes de continuar
}

module.exports = app;