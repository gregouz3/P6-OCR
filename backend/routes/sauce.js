const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.get('/', sauceCtrl.getSauces);
router.post('/', auth, multer, sauceCtrl.createSauce); 
router.get('/:id', auth, sauceCtrl.getSauceById);  
router.put('/:id', auth, multer, sauceCtrl.modifySauce); 
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.countLikeSauce); 

module.exports = router;
