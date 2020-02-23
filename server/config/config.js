//Archivo de configuraciones globales que brinda HEroku
///////////////////////////////////////
// Puerto
process.env.PORT = process.env.PORT || 3000;

/////////////////////////////////////
// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/////////////////////////////////////
// Config Token

//Vencimiento en 30 dias
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30; // 60 segundos * 60 mnutos * 24 horas * 30 dias // No funciona
process.env.CADUCIDAD_TOKEN = '48h'; // duracion del token de 48 horas

// SEED de auntenticacion para desarrollo, en produccion agregar la variable de entorno a heroku

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo-secret';

/////////////////////////////////////
// Base de datos

//Compara el entorno si desarrollo o produccion
if (process.env.NODE_ENV === 'dev') {
    process.env.URL_DB = 'mongodb://localhost:27017/cafe';
}

// Para conectarse a atlas desde desarrollo
// else {
//     //Usando mongo db atlas solo se debe usar en desarrollo y en produccion agregar la variable de entorno a heroku
//     process.env.URL_DB = 'mongodb+srv://lexmaradmin:3L5ybqCBRPQioEsN@cluster0-n0ee5.mongodb.net/cafe?retryWrites=true&w=majority';
// }

/////////////////////////////////////
// Google clienteID
process.env.CLIENT_ID = process.env.CLIENT_ID || '358385518465-4vpme9gd8pov823q5e1cpq6mslqs57l1.apps.googleusercontent.com';