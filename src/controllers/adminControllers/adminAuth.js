const Roles = require('../../models/roles');
const User = require('../../models/user');
// const Seller =require('../../models/seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { parse } = require('path');
const privateKEY = fs.readFileSync('./private.key', 'utf8');
module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            // console.log("loging runusind")
            return res.status(400).json("username or password missing");
        }
        try {
            const admin = await User.findOne({ where: { email: email }, include: [{ model: Roles, attributes: ['name'] }] })
            // console.log(admin.email);
            // console.log(admin.password);
            if (!admin) {
                return res.status(404).json({ msg: "invalid credentials" });
            }
        //    console.log (admin)
            const isMatch = await bcrypt.compare(password, admin.password);
            console.log(isMatch);
            if (!isMatch) {
                return res.status(400).json({ msg: "wrong password" });
                // console.log('if run');
            }
            const payload = {
				user: {
                    id: admin.id,
                    email:admin.email,
					username: admin.full_name,
					role: admin.role.name

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
            res.status(500).send("server error");
        }
    },
    createSeller:async(req,res)=>{
console.log("seller create controller runs")

const {email, full_name,date_of_birth,cnic,phone,address,latitude,longitude,pharmacy_license,isverified  } = req.body;


let { password } = req.body;
if (!email||!full_name||!date_of_birth||!cnic||!phone||!address||!latitude||!longitude||!pharmacy_license||!isverified ) {
    return res.status(400).json("Some fields missing");
}
// const role = "subadmin";
// if (role === "admin") {
// 	return res.json({
// 		msg: "you cannot be admin"
// 	})
// }
try {
    // console.log(username, role, password);
    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hashSync(password, salt);
    if (!password) return res.status(301).send();
    // console.log(password);
    //create gig
    User.create({
       email, full_name,date_of_birth,cnic,phone,address,password,latitude,longitude,pharmacy_license,isverified ,user_role:'7e9ec533-c47d-455b-82ce-c92a7db01224',inacitve:true                                                                                  
    })
        .then(seller => {
            let { password, ...restSeller } = seller.get()
            res.send(restSeller)
        })
        .catch(error =>{
            console.error(error.message);
            res.status(500).send("server errorrr");
        });
}
catch (error) {
    console.error(error.message);
    res.status(500).send("server errorrr");
}
    },
    getSingleSeller:async(req,res)=>{
console.log("get run")
let { id } = req.body;
console.log("s"+id)
let re = /[a-z0-9]{8}-([a-z0-9$]{4}-){3}[a-z0-9]{12}/;
if (!re.test(id)) {
    return res.status(400).json({ msg: "invalid id" })
}
let found = true;
await User.findOne({ where: { id }, attributes: ['id', 'full_name', 'email', 'phone', 'pharmacy_license', 'isverified'] })
    .then((user) => {
        if (!user) {
            found = false;
        }
        else {
            return res.status(200).json({ user })
        }
    })
    .catch(err => {
        console.log(err.message)
        return res.status(500).json({ err: err.name })
    })
if (!found) {
    
    return res.status(404).json({ msg: "no user with this id" })
}
    }
}