
const validarCargaArchivo = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivo a subir --sube al menos un archivo'
        });
    }

    next();
}

module.exports = {
    validarCargaArchivo
}