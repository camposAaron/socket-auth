const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    isAdminRole
} = require('../middlewares/index');

const {
    existsCategoryId,
    existsProduct
} = require('../helpers/db-validator');

const {
    createProduct, getProducts, getProductById, deleteProduct, updateProduct
} = require('../controller/product.controller')

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'el id no es valido').isMongoId(),
    check('id').custom(existsProduct),
    validarCampos
], getProductById);

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id').isMongoId(),
    check('id').custom(existsProduct),
    validarCampos
],
    deleteProduct);

router.put('/:id',[
    validarJWT,
    isAdminRole,
    check('id').isMongoId(),
    check('id').custom(existsProduct),
    check('name').not().isEmpty(),
    check('category').isMongoId(),
    check('category').custom(existsCategoryId),
    validarCampos
],updateProduct);

router.post('/', [
    validarJWT,
    isAdminRole,
    check('name').not().isEmpty(),
    check('category','no es un id de mongo').isMongoId(),
    check('category').custom(existsCategoryId),
    validarCampos

], createProduct);

module.exports = router;

