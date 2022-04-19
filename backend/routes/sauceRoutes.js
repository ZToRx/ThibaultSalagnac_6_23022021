const express = require('express');
const router = express.Router();

const auth = require('../middleware/authorize');
const multer = require('../middleware/multer_config');
const sauceCtrl = require('../controllers/sauceCtrl');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;