const express = require('express');
const router = express.Router();
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

// admin login 
router.post('/login', adminAuth.login);
//end
// //admin creates sub admit
// router.post('/create', auth, adminauth.admincreate);

// //route for getting all users
// router.get('/users',auth,adminauth.getallusers)

// //gets all farmhouses
// router.get('/farmhouses',auth,adminauth.getallfarmhouses);

// //route for getting single user
// router.get('/user',auth,adminauth.getuser)

// //gets single farmhouse
// router.get('/farmhouse',auth,adminauth.getfarmhouse);

// //route for ban user
// router.put('/banuser', auth, adminauth.banuser)

// //route for ban farmhouse
// router.put('/banfarm', auth, adminauth.banfarm)

// //route for user verification
// router.put('/verify-user', auth, adminauth.verifyuser)

// //route for farmhouse verification
// router.put('/verify-farm', auth, adminauth.verifyfarmhouse)


module.exports = router;