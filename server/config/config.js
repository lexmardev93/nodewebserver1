//Archivo de configuraciones globales que brinda HEroku
///////////////////////////////////////
// Puerto
process.env.PORT = process.env.PORT || 3000;

/////////////////////////////////////
// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/////////////////////////////////////
// Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://lexmaradmin:3L5ybqCBRPQioEsN@cluster0-n0ee5.mongodb.net/cafe?retryWrites=true&w=majority'
}

process.env.URL_DB = urlDB;