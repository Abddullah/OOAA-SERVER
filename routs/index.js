const express = require('express')
const router = express.Router();

router.use('/signup', require('./signup'))
router.use('/activatecodesend', require('./activatecodesend'))
router.use('/signin', require('./signin'))
router.use('/resetpassword', require('./resetpassword'))
router.use('/addproduct', require('./addproduct'))
router.use('/products', require('./getproduct'))
router.use('/profile', require('./profile'))
router.use('/addTag', require('./addTag'))
router.use('/addservice', require('./addservice'))

module.exports = router