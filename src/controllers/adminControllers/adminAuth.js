// const Roles = require('../../models/roles');
const Admin = require('../../models/admin');
const Seller = require('../../models/seller');
const formidable = require('formidable');
const Rider = require('../../models/rider');
const Order = require('../../models/order');
const Customer = require('../../models/customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const cryptoRandomString = require('crypto-random-string');
const fs = require('fs');
const { parse } = require('path');
const Sequilize = require('sequelize').Sequelize;
const { async } = require('crypto-random-string');
const op = Sequilize.Op;
const privateKEY = fs.readFileSync('./private.key', 'utf8');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            // console.log("loging runusind")
            return res.status(400).json("username or password missing");
        }
        try {
            const admin = await Admin.findOne({ where: { email } })
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
                    email: admin.email,
                    username: admin.full_name,
                    role: 'admin'

                }
            };
            //creating options
            const signOptions = {
                
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
           
        } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    },
    createSeller: async (req, res) => {
        console.log("seller create controller runs")

        const { email, full_name, date_of_birth, cnic, phone, address, pharmacy_license, store_name, } = req.body;
        let seller = await Seller.findOne({ where: { phone } })
        if (seller) return res.status(400).json({ msg: "seller already exist with this field(s)" })

        seller = await Seller.findOne({ where: { email } })
        if (seller) return res.status(400).json({ msg: "seller already exist with this field(s)" })

        seller = await Seller.findOne({ where: { cnic } })
        if (seller) return res.status(400).json({ msg: "seller already exist with this field(s)" })

        let { password } = req.body;
        if (!email || !full_name || !date_of_birth || !cnic || !phone || !address || !store_name) {
            return res.status(400).json("Some fields missing");
        }
        try {
            // console.log(username, role, password);
            const salt = await bcrypt.genSaltSync(10);
            password = await bcrypt.hashSync(password, salt);
            if (!password) return res.status(301).send();
            // console.log(password);
            //create gig
            // latitude = latitude.toString()
            // longitude = longitude.toString()

            Seller.create({
                inActive: false, email, full_name, date_of_birth, cnic, phone, address, password, pharmacy_license, isVerified: false, store_name, isDelete: false
            })
                .then(seller => {
                    let { password, ...restSeller } = seller.get()
                    res.send(restSeller)
                })
                .catch(error => {
                    console.error(error.message);
                    res.status(500).send("server errorrr");
                });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("server errorrr");
        }
    },
    getSingleSeller: (req, res) => {
        console.log("get run")
        let { id } = req.params;
        // console.log("s"+id)
        let re = /[a-z0-9]{8}-([a-z0-9$]{4}-){3}[a-z0-9]{12}/;
        if (!re.test(id)) {
            return res.status(400).json({ msg: "invalid id" })
        }
        let found = true;
        Seller.findOne({ where: { id, isDelete: false }, attributes: ['id', 'full_name', 'cnic', 'email', 'phone', 'pharmacy_license', 'isVerified', 'store_name', 'address', 'inActive'] })
            .then((seller) => {
                if (!seller) {
                    found = false;
                }
                else {
                    Order.findAll({ where: { seller_id: seller.id }, attributes: ['sellerRating'] })
                        .then((a) => {
                            console.log(a)
                            const ratings = a.map(object => object.sellerRating)
                            let averageRating = ratings.reduce((a, b) => { return a + b; }, 0) / ratings.length;
                            return res.status(200).json({ seller, averageRating })

                        })
                }
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })
        if (!found) {

            return res.status(404).json({ msg: "no user with this id" })
        }
    },
    getAllsellers: (req, res) => {
        //getting all users
        Seller.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                isDelete: false,
                cnic: {
                    [op.iLike]: `${req.query.seacrhterm}%`
                },
            },
            attributes: ['id', 'full_name', 'store_name', 'phone', 'cnic', 'address'],
            include: [{
                model: Order,
                attributes: ['sellerRating']
            }]
        })
            .then((sellers) => {
                res.status(200).json({ sellers })
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })
    },
    updateseller: (req, res) => {
        const {
            id, email, full_name, phone, address, latitude, longitude, pharmacy_license, isVerified, inActive, isDelete, store_name
        } = req.body;
        /////////////////
        try {
            Seller.update(
                {
                    id, email, store_name, full_name, phone, address, latitude, longitude, pharmacy_license, isVerified, inActive, isDelete
                },
                { where: { id } })
                .then(() => res.status(200).json({ msg: "profile updated" }))

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    },
    deleteSeller: (req, res) => {
        const { id } = req.query;
        /////////////////
        try {
            Seller.update({
                isDelete: true
            }, { where: { id } })
                .then(() => res.status(200).json({ msg: "profile deleted" }))

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }

    },
    createRider: async (req, res) => {
        console.log("rider create controller runs")

        const { email, full_name, date_of_birth, cnic, phone, address, driving_license } = req.body;
        let rider = await Rider.findOne({ where: { phone } })
        if (rider) return res.status(400).json({ msg: "rider already exist with this field(s)" })

        rider = await Rider.findOne({ where: { email } })
        if (rider) return res.status(400).json({ msg: "rider already exist with this field(s)" })

        rider = await Rider.findOne({ where: { cnic } })
        if (rider) return res.status(400).json({ msg: "rider already exist with this field(s)" })

        let { password } = req.body;
        if (!email || !full_name || !date_of_birth || !cnic || !phone || !address ) {
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
            // latitude = latitude.toString()
            // longitude = longitude.toString()

            Rider.create({
                email, full_name, date_of_birth, cnic, phone, address, password, driving_license, isVerified: false, inActive: false, isDelete: false
            })
                .then(rider => {
                    let { password, ...restRider } = rider.get()
                    res.send(restRider)
                })
                .catch(error => {
                    console.error(error.message);
                    res.status(500).send("server errorrr");
                });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("server errorrr");
        }
    },
    getSingleRider: (req, res) => {
        console.log("get run")
        let { id } = req.params;
        // console.log("s"+id)
        let re = /[a-z0-9]{8}-([a-z0-9$]{4}-){3}[a-z0-9]{12}/;
        if (!re.test(id)) {
            return res.status(400).json({ msg: "invalid id" })
        }
        let found = true;
        Rider.findOne({ where: { id }, attributes: ['id', 'full_name', 'email', 'phone', 'address', 'cnic', 'driving_license', 'isVerified', 'inActive'] })
            .then((rider) => {
                if (!rider) {
                    found = false;
                }
                else {
                    // console.log("anari",rider.id)
                    Order.findAll({ where: { rider_id: rider.id }, attributes: ['riderRating'] })
                        .then((a) => {
                            // console.log(a)
                            const ratings = a.map(object => object.riderRating)
                            let averageRating = ratings.reduce((a, b) => { return a + b; }, 0) / ratings.length;
                            return res.status(200).json({ rider, averageRating })
                        })

                }
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })
        if (!found) {

            return res.status(404).json({ msg: "no user with this id" })
        }
    },
    getAllRiders: (req, res) => {

        //getting all users
        Rider.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                isDelete: false,
                cnic: {
                    [op.iLike]: `${req.query.searchterm}%`
                },
            }

            , attributes: ['id', 'full_name', 'phone', 'cnic', 'address'], include:
                [{ model: Order, attributes: ['riderRating'] }]
        })
            .then((users) => {
                res.status(200).json({ riders: users })
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })

    },
    updateRider: (req, res) => {
        const {
            id, email, full_name, date_of_birth, cnic, phone, address, latitude, longitude, driving_license, isVerified, inActive
        } = req.body;
        /////////////////
        try {
            Rider.update(
                {
                    id, email, full_name, date_of_birth, cnic, phone, address, latitude, longitude, driving_license, isVerified, inActive
                },
                { where: { id } })
                .then(() => res.status(200).json({ msg: "profile updated" }))

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    },
    deleteRider: (req, res) => {
        const { id } = req.query;
        /////////////////
        try {
            Rider.update({
                isDelete: true
            },
                { where: { id } })
                .then(() => res.status(200).json({ msg: "profile deleted" }))
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    },
    getSingleCustomer: (req, res) => {
        console.log("get run")
        let { id } = req.params;
        // console.log("s"+id)
        let re = /[a-z0-9]{8}-([a-z0-9$]{4}-){3}[a-z0-9]{12}/;
        if (!re.test(id)) {
            return res.status(400).json({ msg: "invalid id" })
        }
        let found = true;
        Customer.findOne({ where: { id }, attributes: ['id', 'address', 'cnic', 'full_name', 'email', 'phone'] })
            .then((customer) => {
                if (!customer) {
                    found = false;
                }
                else {
                    return res.status(200).json({ customer })
                }
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })
        if (!found) {

            return res.status(404).json({ msg: "no user with this id" })
        }
    },
    getAllCustomers: (req, res) => {

        //getting all users
        Customer.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
            , attributes: ['id', 'cnic', 'full_name', 'phone', 'address', 'email']
        })
            .then((customers) => {
                res.status(200).json({ customers })
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })
    },
    updateCustomer: (req, res) => {
        const {
            id,
            inActive
        } = req.body;
        /////////////////
        try {
            Customer.update(
                { inActive },
                { where: { id } })
                .then(() => res.status(200).json({ msg: "profile updated" }))

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    },
    getAllOrders: (req, res) => {

        //getting all users
        Order.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
            , attributes: ['id', 'customer_id', 'seller_id', 'rider_id', 'iscompleted', 'inprocess', 'riderRating', 'sellerRating', 'isdelete', 'description', 'review', 'items', 'itemsQuantity', 'image', 'amount', 'createdAt'], include: [{ model: Seller, attributes: ['full_name', 'email', 'store_name'] }, { model: Rider, attributes: ['full_name'] }, { model: Customer, attributes: ['full_name'] }]
        })
            .then((orders) => {
                res.status(200).json({ orders })
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })
    },
    getAllSales: (req, res) => {
        console.log("getALlSales")
        //getting all users
        Order.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
            , where: { iscompleted: true }, attributes: ['id', 'iscompleted', 'inprocess', 'createdAt', 'amount'], include: [{ model: Seller, attributes: ['full_name', 'email', 'store_name'] }, { model: Rider, attributes: ['full_name'] }, { model: Customer, attributes: ['full_name'] }]
        })
            .then((orders) => {
                res.status(200).json({ orders })
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })
    },
    getSingleOrder: (req, res) => {
        console.log("Single Order Running")
        const { id } = req.params;
        const re = /[a-z0-9]{8}-([a-z0-9$]{4}-){3}[a-z0-9]{12}/;
        if (!re.test(id)) {
            return res.status(400).json({ msg: "Invalid Id" })
        }
        const found = true;
        Order.findOne({
            where: { id }, attributes: ['id', 'customer_id', 'seller_id', 'rider_id', 'iscompleted', 'inprocess', 'riderRating', 'sellerRating', 'isdelete', 'description', 'review', 'items', 'itemsQuantity', 'image', 'amount', 'createdAt'], include: [{ model: Seller, attributes: ['full_name', 'email', 'store_name'] }, { model: Rider, attributes: ['full_name'] }, { model: Customer, attributes: ['full_name'] }]
        })
            .then((order) => {
                if (!order) {
                    found = false;
                }
                else {
                    return res.status(200).json({ order })
                }
            })
            .catch((err) => {
                return res.status(500).json({ err: err.name })
            })
        if (!found) {
            return res.status(404).json({ msg: "No Order With this id" })
        }

    },
    forgetPassword: async (req, res) => {
        const { email } = req.body;
        Admin.findOne({ where: { email } })
            .then((admin) => {
                if (!admin) {
                    return res.status(400).json({ msg: "bad request" })
                }
                const { id } = admin;
                const newPassword = cryptoRandomString({ length: 10, type: 'base64' })
                if (!newPassword) return res.status(301).send();
                const salt = bcrypt.genSaltSync(10);
                if (!salt) return res.status(301).send();
                const passwordHash = bcrypt.hashSync(newPassword, salt);
                if (!passwordHash) return res.status(301).send();
                Admin.update({ password: passwordHash }, { where: { id } })
                    .then(() => {
                        console.log(newPassword, passwordHash, "new pas,password hash")
                        const msg = {
                            to: `${email}`,
                            from: 'hussainashir87@gmail.com',
                            subject: 'Request for new password',
                            text: 'Your password has been changed',
                            html: `<p><strong>New password : </strong>${newPassword}</p>`,
                        };
                        sgMail.send(msg);
                        return res.json({ msg: "Password sended to your email" })
                    })
            })
            .catch(error => {
                console.error(error.message);
                return res.status(500).send("server error");
            })

    },
    uploadDrivingLicense: async (req, res) => {
        const { id } = req.query;
        // const newfilename=res.locals.newfilename
        if (!id) return res.status(400).json({ msg: "bad request" })
        let image
        // let newfilename
        const form = new formidable.IncomingForm();
        console.log(id)
        form.on('fileBegin', (name, file) => {
            console.log(name)
            file.name = file.name.replace(/\s/g, '');
            let format = file.name.slice(file.name.lastIndexOf('.'))
            if (format !== ".jpg" && format !== ".jpeg" && format !== '.JPG') return res.json({ msg: "please upload image in jpg or jpeg format" })
            // console.log(format)

            let newfilename = Date.now()
            console.log(newfilename)
            newfilename += format
            image = newfilename
            file.path = "src/public/uploads/drivinglicense/" + newfilename
            // image = newfilename
            // uploaded=true;
        })
        let formfield = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err);
                    reject()
                    return;
                }
                resolve();
            });
        })
        console.log("after")
        // console.log(id,newfilename,"from update database")
        Rider.update(
            { driving_license: image },
            { where: { id } }
        )
            .then(() => {
                return res.status(200).json({ msg: "image uploaded sucessfully" })
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).send("server error");
            })
    },
    uploadPharmacyLicense: async (req, res) => {
        const { id } = req.query;
        // const newfilename=res.locals.newfilename
        if (!id) return res.status(400).json({ msg: "bad request" })
        let image
        // let newfilename
        const form = new formidable.IncomingForm();
        console.log(id)
        form.on('fileBegin', (name, file) => {
            console.log(name)
            file.name = file.name.replace(/\s/g, '');
            let format = file.name.slice(file.name.lastIndexOf('.'))
            if (format !== ".jpg" && format !== ".jpeg" && format !== '.JPG') return res.json({ msg: "please upload image in jpg or jpeg format" })
            // console.log(format)

            let newfilename = Date.now()
            console.log(newfilename)
            newfilename += format
            image = newfilename
            file.path = "src/public/uploads/pharmacylicense/" + newfilename
            // image = newfilename
            // uploaded=true;
        })
        let formfield = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err);
                    reject()
                    return;
                }
                resolve();
            });
        })
        console.log("after")
        // console.log(id,newfilename,"from update database")
        Seller.update(
            { pharmacy_license: image },
            { where: { id } }
        )
            .then(() => {
                return res.status(200).json({ msg: "image uploaded sucessfully" })
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).send("server error");
            })
    },
    getAdmin: (req, res) => {
        try {
            // console.log('from controller',req.payload.id)
            const id = req.payload.id
            Admin.findOne({ where: { id }, attributes: ['id', 'full_name', 'phone', 'email'] })
                .then((Admin) => {
                    return res.status(200).json({ Admin })
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(500).send("server error");
                })
        } catch (error) {
            console.log(err)
            return res.status(500).send("server error");
        }
    },

    getDashboardStats: async (req, res) => {
        //confirm orders
        let noofcompleted;
        let noofpending;
        let revenue = [];
        let totalrevenue;

        //confirm orders
        await Order.count({
            where: { iscompleted: true },
        }).then(complete => {
            noofcompleted = complete;
        })
            .catch(err => res.status(500).json(err));

        //Pending orders
        await Order.count({
            where: { iscompleted: false },
        }).then(pending => {
            noofpending = pending;
        })
            .catch(err => res.status(500).json(err));

        //Total Revenue
        await Order.findAll({
            where: { iscompleted: true }, attributes: ['amount']
        }).then(r => {
            for (let t = 0; t < r.length; t++) {
                revenue.push(Number(r[t].amount))
            }
            console.log(revenue);
            totalrevenue = revenue.reduce((a, b) => a + b, 0)
        })
            .catch(err => res.status(500).json(err));
        console.log(totalrevenue);

        res.json({
            noofcompleted,
            noofpending,
            totalrevenue
        });



    },

    getAllRatingsRiders: (req, res) => {

        //getting all users
        Rider.findAll({
            where: {
                isDelete: false,
            }

            , attributes: ['id', 'full_name', 'cnic'], include:
                [{ model: Order, attributes: ['riderRating'] }]
        })
            .then((users) => {
                let riders = JSON.parse(JSON.stringify(users));
                for (let j = 0; j < riders.length; j++) {
                    let sumofRating = 0, avgRating = 0;
                    for (let i = 0; i < riders[j].orders.length; i++) {
                        sumofRating += riders[j].orders[i].riderRating;
                    }
                    avgRating = sumofRating/riders[j].orders.length
                    riders[j].averageRating = avgRating;
                }
                res.status(200).json({ riders })

            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).json({ err: err.name })
            })
    },

    getAllRatingSellers:(req,res)=>{
        //getting all users
        Seller.findAll({
            where:{
                isDelete:false,
            },
            attributes:['id','full_name','cnic'],include:
            [{model: Order , attributes:['sellerRating']}]
        })
        .then((users)=>{
            let sellers = JSON.parse(JSON.stringify(users));
            for(let j = 0 ; j < sellers.length ; j++){
                let sumofRating = 0 , avgRating = 0;
                for (let i = 0; i < sellers[j].orders.length; i++) {
                    sumofRating += sellers[j].orders[i].sellerRating;
                    
                }

                avgRating =sumofRating/sellers[j].orders.length
                sellers[j].averageRating=avgRating;
            }

            res.status(200).json({sellers})
        })
        .catch(err=>{
            console.log(err.message)
            return res.status(500).json({err:err.name})
        })

    }   

}