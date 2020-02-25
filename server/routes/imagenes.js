const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificarTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:imagen', verificarTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let imagen = req.params.imagen;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
    } else {
        return res.sendFile(noImagePath);
    }
});


module.exports = app;