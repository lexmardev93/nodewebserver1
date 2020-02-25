const express = require('express');
const app = express();

app.use(require('./login'));
app.use(require('./usuarios'));
app.use(require('./categorias'));
app.use(require('./productos'));
app.use(require('./uploads'));
app.use(require('./imagenes'));

module.exports = app; //Ojo con el export