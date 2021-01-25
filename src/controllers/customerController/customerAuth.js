const bcrypt = require('bcryptjs');
const Customer = require('../../models/customer');
const Verification = require('../../models/verification');
const formidable = require('formidable');
const Order =require('../../models/order');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKEY = fs.readFileSync('./private.key', 'utf8');
const cryptoRandomString = require('crypto-random-string');
const sgMail = require('@sendgrid/mail');
const webpush = require("web-push");
const publicVapidKey ="BLDECqQgUgclNByCuKfh7F5Y863XpwVwcpgTwNDxqnw829GTmHHxYnJ3gso3FegKDSeeivjAp0Q4dGzyBu9KDZw";
const privateVapidKey = "UoL2MqxRUQjDcJYZTnSmKbfqQglwODIOgNnrMcNmvK4";
webpush.setVapidDetails("mailto:test@test.com",
publicVapidKey,privateVapidKey);

// const { where } = require('sequelize/types');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



module.exports = {
	register: async (req, res) => {
		const { full_name, email, date_of_birth, cnic, phone, address, longitude, latitude } = req.body;

		let { password } = req.body;
		if (!full_name || !phone || !password || !email) {
			return res.status(400).json("please fill all fields")
		}
		try {
			const salt = await bcrypt.genSaltSync(10);
			password = await bcrypt.hashSync(password, salt);
			Customer.create({ full_name, email, password, date_of_birth, cnic, phone, address, longitude, latitude, isDelete: false, isVerified: false, inActive: false })
				.then((customer) => {
					const { id, ...restcustomerdata } = customer;
					//send email  for verification process
					// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

					//creating verification token
					const token = cryptoRandomString({ length: 60, type: 'base64' });

					Verification.create({ token, customer_id: id })
						.then(() => {

							const msg = {
								to: 'hussainashir9090@gmail.com',
								from: 'hussainashir87@gmail.com',
								subject: 'Account Verification Email',
								text: 'Please click on the link below to verify your account',
								html: `<strong>http://localhost:5000/customer/verification?id=${id}&token=${token}</strong>`,
							};
							sgMail.send(msg);
							return res.json({ msg: "email sended! Please verify account" })
						})





					//payload for token
					// const payload = {
					// 	customer: {
					// 		id
					// 	}
					// };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
					//creating sign options
					// const signOptions = {
					// 	expiresIn: "12h",
					// 	algorithm: "RS512"
					// };
					// jwt.sign(payload, privateKEY, signOptions, (err, token) => {
					// 	if (err) { console.log(err) };
					// 	res.status(200).json({ token })
					// });
				})
		} catch (error) {
			console.error(error.message);
			return res.status(500).send("server error");
		}
	},
	verifyIdentity: (req, res) => {
		const { id, token } = req.query;
		Verification.findOne({ where: { token } })
			.then(() => {
				Customer.update({isVerified:true},{ where: { id }})
					.then(() => {
						Verification.destroy({ where: { token } })
							.then(() => {
							// console.log(a)
								return res.json({ msg: "customer verified" })
							})
							.catch((error) => {
								console.error(error.message);
								return res.status(500).send("server error");
							})
					})
					.catch((error) => {
						console.error(error.message);
						return res.status(500).send("server error");
					})
			})
			.catch((error) => {
				console.error(error.message);
				return res.status(500).send("server error");
			})
	},
	login:async(req,res)=>{
const {email,password}=req.body;
console.log(typeof email)
if (!email || !password) {
	// console.log("loging runusind")
	return res.status(400).json({msg:"username or password missing"});
}
try {
	const customer = await Customer.findOne({ where: { email } })
	// console.log(admin.email);
	// console.log(admin.password);
	if (!customer) {
		return res.status(404).json({ msg: "invalid credentials" });
	}
	if(customer.isVerified=='false'){
		return res.status(403).json({msg:"forbidden Please verify your email first"})
	}
	//    console.log (admin)
	const isMatch = await bcrypt.compare(password, customer.password);
	console.log(isMatch);
	if (!isMatch) {
		return res.status(400).json({ msg: "wrong password" });
		// console.log('if run');
	}
	const payload = {
		customer: {
			id: customer.id,
			email: customer.email,
			username: customer.full_name,
			role: 'customer'

		}
	};
	//creating options
	const signOptions = {
		// issuer: i,
		// subject: s,
		// audience: a,
		expiresIn: "12h",
		algorithm: "RS512"
	};
	//jwt token creation
	jwt.sign(payload, privateKEY, signOptions
		// res.json(token);
		, (err, token) => {
			if (err) { throw err };
			res.json({ token })
		});
	// console.log(token);
	// return res.json({admin})
	
} catch (error) {
	console.error(error.message);
	return res.status(500).send("server error");
}


	},
	placeOrder:async(req,res)=>{
		// const {id,items,itemsQuantity}=req.body;
		let image;
		try {
			const form = new formidable.IncomingForm();
			// console.log(req.body)
			form.on('fileBegin', (name, file) => {
				// console.log(name)
				file.name = file.name.replace(/\s/g, '');
				let format = file.name.slice(file.name.lastIndexOf('.'))
				if (format !== ".jpg" && format !== ".jpeg"&&format!=='.JPG') return res.json({ msg: "please upload image in jpg or jpeg format" })
				// console.log(format)
				
				let newfilename = Date.now()
				image = newfilename
				newfilename+=format

				file.path = "./uploads/priscription/images/" + newfilename
				// image = newfilename
				// uploaded=true;
			})

			let formfields = await new Promise((resolve, reject) => {
				form.parse(req, (err, fields, files) => {
					// console.log(fields)
					if (err) {
						console.log(err);
					console.log("reject")
						reject()
						return;
					}
					console.log("resolve")
					resolve(fields);
				});
			})
			let {id,items,itemsQuantity}=formfields;
			if(items.length&&itemsQuantity.length){
			console.log("ashorhussain",id,items.length,itemsQuantity.length,image)
			items=items.split(',')
			itemsQuantity=itemsQuantity.split(',')
			console.log(items,itemsQuantity)
 
			}
			else{
				items=[]
				itemsQuantity=[]
				console.log(items,itemsQuantity)
			}
			if(!items.length&&!itemsQuantity.length&&!image){
				return res.status(404).json({msg:"no data found"})
			}
		
			Order.create({
				customer_id:id,
				image,
				items:items,
				itemsQuantity:itemsQuantity
			})
				.then(() => {
					//push notifications for sellers
					const title="push notifications"
					const message="this is push notification"
					const subscription="An order has been arrived"
					const payload = JSON.stringify({ title, message });
					webpush.sendNotification(subscription, payload)
					.catch((err) => console.error("err", err));

					console.log("then")
				return res.status(200).json({ msg: "order is been placed" })
				})
				.catch((error)=>{
					console.log(error)
			return res.status(500).send("server error");

				})
		}
		catch (error) {
			console.log(error)

			return res.status(500).send("server error");
		}
		/////
	},
	addReview:(req,res)=>{
		const {customer_id,order_id,review}=req.body;
		if (!customer_id || !order_id||!review) {
			// console.log("loging runusind")
			return res.status(400).json({msg:"customer, order id and review required"});
		}
		try {
			Order.findOne({where:{id:order_id}})
			.then((order)=>{
				if(order.customer_id!==customer_id){
					return res.status(400).send("Bad Request")
				}
				Order.update( {review },
				{ where: { id:order_id } })
				.then(()=>{
					return res.status(200).json({msg:"Review added successfully"})
				})
			})
			.catch((error)=>{
				console.error(error.message);
			return	res.status(404).send("No order Found");

			})
			
		} catch (error) {
			console.error(error.message);
			res.status(500).send("server error");
		}
console.log("review added")
	}
}