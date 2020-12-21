// const { async } = require('crypto-random-string');
const Rider=require('../../models/rider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKEY = fs.readFileSync('./private.key', 'utf8');


module.exports={
    login:async(req,res)=>{
console.log("rider login")
const {email,password}=req.body;
if (!email || !password) {
	// console.log("loging runusind")
	return res.status(400).json({msg:"username or password missing"});
}
try {
	const rider = await Rider.findOne({ where: { email } })
	// console.log(admin.email);
	// console.log(admin.password);
	if (!rider) {
		return res.status(404).json({ msg: "invalid credentials" });
	}
	if(rider.isVerified=='false'){
		return res.status(403).json({msg:"forbidden Please verify your account first"})
	}
	//    console.log (admin)
	const isMatch = await bcrypt.compare(password, rider.password);
	console.log(isMatch);
	if (!isMatch) {
		return res.status(400).json({ msg: "wrong password" });
		// console.log('if run');
	}
	const payload = {
		rider: {
			id: rider.id,
			email: rider.email,
			username: rider.full_name,
			role: 'rider'
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
    }
}