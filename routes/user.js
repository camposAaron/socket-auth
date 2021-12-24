const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    isAdminRole,
    haveRole
} = require('../middlewares');

const { isRoleValid, existsEmail, existsId } = require('../helpers/db-validator');

const { getUsers,
       putUsers, 
       postUsers, 
       deleteUsers, 
       patchUsers } = require('../controller/users.controller');
    
const router = Router();

router.get('/', getUsers);

router.put('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existsId ),
    validarCampos
], putUsers);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe contener al menos 5 caracteres').isLength({ min: 6}),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(existsEmail),
    // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom(isRoleValid),
    validarCampos
], postUsers);

router.delete('/:id',[
    validarJWT,
//    isAdminRole,
    haveRole('ADMIN_ROLE', 'SALES_ROLE', 'OTHER_ROLE'),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existsId ),
    validarCampos
], deleteUsers);



module.exports = router;

