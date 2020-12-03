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
router.get('/',adminAuthMidd,adminAuth.getSingleSeller)


module.exports = router;