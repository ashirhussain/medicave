const express = require('express');
const router = express.Router();
const customerAuth=require('../../src/controllers/customerController/customerAuth');
const customerAuthMidd=require('../../middleWare/customerAuth');

//route for customer register
router.post('/register',customerAuth.register);

//route for customer verification
router.get('/verification',customerAuth.verifyIdentity)

//route for customer login
router.post('/login',customerAuth.login)

//route for place an order
router.post('/place-order',customerAuthMidd,customerAuth.placeOrder)




module.exports = router;