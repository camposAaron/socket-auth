const { finder } = require('../controller/find.controller');

const { Router } = require('express');
const router = Router();

router.get('/:collection/:term', finder);


module.exports = router;
