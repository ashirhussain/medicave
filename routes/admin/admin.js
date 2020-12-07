const express = require('express');
const router = express.Router();
const adminAuthMidd=require('../../middleWare/adminAuth')
// const auth = require('../../middleware/auth');
const adminAuth = require('../../src/controllers/adminControllers/adminAuth.js');
// const bcrypt = require('bcryptjs');
// const Admin = require('../../models/admin/admin');
// const adminauth=require('../../controllers/adminController/adminauth')

// 'use strict';
// const fs = require('fs');
// PRIVATE and PUBLIC key
// const path = require('path');
// let pkey = fs.readFileSync(path.join(__dirname, 'private.key'));
// const privateKEY=require('../config/')
// PAYLOAD
//

// SIGNING OPTIONS


// // creates admin
// router.post('/create', async (req, res) => {
// 	const { username, role } = req.body;
// 	let { password } = req.body;
// 	//  signedin=false;
// 	// console.log(username, role, password);
// 	password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// 	if (!password) return res.status(301).send();
// 	// console.log(password);
// 	//create gig
// 	Admin.create({
// 		username,
// 		role,
// 		password,
// 		signedin: false
// 	})
// 		.then(admin => res.json("user created"))
// 		.catch(err => console.log(err));
// });

// route for admin login 
router.post('/login', adminAuth.login);

//route for create seller
router.post('/create-seller',adminAuthMidd,adminAuth.createSeller)

//route for get seller
router.get('/seller/:id',adminAuthMidd,adminAuth.getSingleSeller)

//route for getting all sellers
router.get('/sellers',adminAuthMidd,adminAuth.getAllsellers)

//route for updating seller
router.put('/seller',adminAuthMidd,adminAuth.updateseller)

//route to delete seller
router.delete('/seller',adminAuthMidd,adminAuth.deleteSeller)

//route to create rider
router.post('/create-rider',adminAuthMidd,adminAuth.createRider)

//route to get single rider
router.get('/rider/:id',adminAuthMidd,adminAuth.getSingleRider)

//route to get all riders
router.get('/riders',adminAuthMidd,adminAuth.getAllRiders)

//route for updating rider
router.put('/rider',adminAuthMidd,adminAuth.updateRider)

//route for delete rider
router.delete('/rider',adminAuthMidd,adminAuth.deleteRider)

//route for getting single customer
router.get('/customer/:id',adminAuthMidd,adminAuth.getSingleCustomer)

//route for getting all customers
router.get('/customers',adminAuthMidd,adminAuth.getAllCustomers)

//route to update customer
router.put('/customer',adminAuthMidd,adminAuth.updateCustomer)

//route for getting all orders
router.get('/orders',adminAuthMidd,adminAuth.getAllOrders)

//route to get all sales
router.get('/sales',adminAuthMidd,adminAuth.getAllSales)




module.exports = router;