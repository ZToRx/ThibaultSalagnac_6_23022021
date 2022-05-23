const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const checkInput = require('../middleware/inputCheck')

router.post('/signup', checkInput, userCtrl.signup);
router.post('/login', checkInput, userCtrl.login);

module.exports = router;