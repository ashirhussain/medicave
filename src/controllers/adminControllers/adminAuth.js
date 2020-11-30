const Roles = require('../../models/roles');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
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
    }
}