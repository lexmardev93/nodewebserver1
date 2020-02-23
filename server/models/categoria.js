const mongoose = require('mongoose'); // Importamos mongoose
const Schema = mongoose.Schema; // Creamos el objeto schema que proviene de mongoose
const uniqueValidator = require('mongoose-unique-validator'); // Para validar valores unicos

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

// Validacion para valores unicos
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único' // mensaje donde path corresponde a la propiedad
});

// Exportamos

module.exports = mongoose.model('Categoria', categoriaSchema);