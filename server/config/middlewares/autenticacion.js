const jwt = require('jsonwebtoken');

//Verificar token
let verificarToken = (req, res, next) => {
    //Obtenemos el token del header
    let token = req.get('token');

    //verificamos token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                error: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

//Verificar role
let verificarRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

module.exports = {
    verificarToken,
    verificarRole
}