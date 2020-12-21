const express = require('express');
const router = express.Router();
const riderAuth=require('../../src/controllers/riderController/riderAuth');

//rider login
router.post('/login',riderAuth.login)



module.exports = router;