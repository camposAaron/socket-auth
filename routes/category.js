const { Router, response } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    isAdminRole
} = require('../middlewares/index');

const { existsCategoryId } = require('../helpers/db-validator');


const {
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    createCategory
} = require('../controller/category.controller');

const router = Router();
/*
    {{URL}}/api/category
*/

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria - publico
router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existsCategoryId),
    validarCampos
], getCategory);

// crear categoria - private - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createCategory);

// Actualizar una categoria - private -cualquiera con token valido
router.put('/:id', [
    validarJWT,
    isAdminRole,
    check('name').not().isEmpty(),
    check('state').isBoolean(),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existsCategoryId),
    validarCampos
],
    updateCategory);

//Borrar una categoria -Admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id','el id no es valido').isMongoId(),
    check('id').custom(existsCategoryId),
    validarCampos
],
    deleteCategory);

module.exports = router;

