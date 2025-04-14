const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.use('/', publicController);

module.exports = router;