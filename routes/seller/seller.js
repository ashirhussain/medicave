const express = require('express');
const router = express.Router();
const sellerAuth=require('../../src/controllers/sellerController/sellerAuth');

//rider login
router.post('/login',sellerAuth.login)



module.exports = router;