const express = require('express');
const router = express.Router();
const controller = require('../controllers/bestShipment');

router.get('/', controller.index);
router.post('/', controller.find);
router.post('/ship', controller.ship);

module.exports = router;