const { Router } = require('express');
const { validarCampos, validarJWT } = require('../middlewares');
const { check } = require('express-validator');
const { login, googleSignin, renovarJWT } = require('../controller/auth.controller');

const router = Router();

router.post('/login',[
    check('email','El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos 
], login);

router.post('/google',[
    check('id_token','El id token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );

//servicio para renovar/validar token
router.get('/', validarJWT, renovarJWT);

module.exports =  router;