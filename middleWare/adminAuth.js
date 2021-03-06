const jwt = require('jsonwebtoken');
// const config = require('config');
const fs = require('fs');
const publicKEY = fs.readFileSync('./public.key', 'utf8');


module.exports = (req, res, next) => {

	//get token for header
	const token = req.header('x-auth-token');
	//checkk if not token

	if (!token) {
		return res.status(401).json({ msg: "no token,auth denied!" });

	}

	try {
		// 
		const verifyOptions = {

			expiresIn: "12h",
			algorithm: ["RS512"]
		};

		const decoded = jwt.verify(token, publicKEY, verifyOptions);

		console.log(decoded.user.role)
		if (decoded.user.role == 'admin') {

			req.payload = decoded.user
			next();
		}


	} catch (error) {
		console.error(error);
		res.status(401).json({ msg: "token is not valid" });
	}

}