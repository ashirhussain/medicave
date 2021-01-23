// const Roles = require('../../models/roles');
const Admin = require('../../models/admin');
const Seller = require('../../models/seller');
const Rider = require('../../models/rider');
const Order = require('../../models/order');
const Customer = require('../../models/customer');
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
    createSeller: async (req, res) => {
        console.log("seller create controller runs")

        const { email, full_name, date_of_birth, cnic, phone, address, pharmacy_license, inActive, store_name,} = req.body;


        let { password} = req.body;
        if (!email || !full_name || !date_of_birth || !cnic || !phone || !address || !pharmacy_license || !inActive || !store_name) {
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
                inActive, email, full_name, date_of_birth, cnic, phone, address, password, pharmacy_license, isVerified:false, store_name, isDelete:false
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
        Seller.findOne({ where: { id,isDelete:false }, attributes: ['id', 'full_name','cnic', 'email', 'phone', 'pharmacy_license', 'isVerified','store_name','address'] })
            .then((seller) => {
                if (!seller) {
                    found = false;
                }
                else {
                    Order.findAll({where:{seller_id:seller.id},attributes:['sellerRating']})
                    .then((a)=>{
                        console.log(a)
                        const ratings=a.map(object=>object.sellerRating)
                        let averageRating=ratings.reduce((a,b)=>{return a+b;},0)/ratings.length;
                        return res.status(200).json({ seller,averageRating })

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
        Seller.findAll({where:{
            isDelete:false
        }, attributes: ['id','full_name', 'store_name','phone', 'address'],include:
         [{model:Order,attributes:['sellerRating']}]
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
                isDelete:true
            },{where: { id } })
                .then(() => res.status(200).json({ msg: "profile deleted" }))

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }

    },
    createRider: async (req, res) => {
        console.log("rider create controller runs")

        const { email, full_name, date_of_birth, cnic, phone, address, driving_license, inActive} = req.body;


        let { password} = req.body;
        if (!email || !full_name || !date_of_birth || !cnic || !phone || !address || !driving_license) {
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
                email, full_name, date_of_birth, cnic, phone, address, password, driving_license, isVerified:false, inActive, isDelete:false
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
        Rider.findOne({ where: { id }, attributes: ['id', 'full_name', 'email', 'phone','address','cnic', 'driving_license', 'isVerified'] })
            .then((rider) => {
                if (!rider) {
                    found = false;
                }
                else {
                    // console.log("anari",rider.id)
                        Order.findAll({where:{rider_id:rider.id},attributes:['riderRating']})
                        .then((a)=>{
                            // console.log(a)
                            const ratings=a.map(object=>object.riderRating)
                            let averageRating=ratings.reduce((a,b)=>{return a+b;},0)/ratings.length;
                            return res.status(200).json({ rider, averageRating})
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
        Rider.findAll({ attributes: ['id','full_name','phone', 'address'],include:
        [{model:Order,attributes:['riderRating']}]
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
            Rider.destroy({ where: { id } })
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
        Customer.findOne({ where: { id }, attributes: ['id', 'full_name', 'email', 'phone'] })
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
        Customer.findAll({ attributes: ['full_name', 'phone', 'address'] })
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
        getAllOrders:(req,res)=>{

            //getting all users
            Order.findAll({ attributes: ['id','customer_id','seller_id','rider_id','iscompleted', 'inprocess','riderRating','sellerRating','isdelete','description','review','items','itemsQuantity','image','amount','createdAt'],include:[{model:Seller,attributes:['full_name','email','store_name']},{model:Rider,attributes:['full_name']},{model:Customer,attributes:['full_name']}]})
                .then((orders) => {
                    res.status(200).json({ orders })
                })
                .catch(err => {
                    console.log(err.message)
                    return res.status(500).json({ err: err.name })
                })
        },
        getAllSales:(req,res)=>{
            console.log("getALlSales")
             //getting all users
             Order.findAll({ where:{iscompleted:true}, attributes: ['id','iscompleted', 'inprocess','createdAt'],include:[{model:Seller,attributes:['full_name','email','store_name']},{model:Rider,attributes:['full_name']},{model:Customer,attributes:['full_name']}]})
             .then((orders) => {
                 res.status(200).json({ orders })
             })
             .catch(err => {
                 console.log(err.message)
                 return res.status(500).json({ err: err.name })
             })
        },
        getSingleOrder:(req,res)=>{
            const{id}=req.params;
            const re=/[a-z0-9]{8}-([a-z0-9$]{4}-){3}[a-z0-9]{12}/;
            if(!re.test(id)){
                return res.status(400).json({msg:"Invalid Id"})
            }
            const found=truw;
            Order.findOne({
                where:{id}, attributes:['id','customer_id','seller_id','rider_id','iscompleted', 'inprocess','riderRating','sellerRating','isdelete','description','review','items','itemsQuantity','image','amount','createdAt']
            })
            .then((order)=>{
                if(!order){
                    found=false;
                }
                else{
                    return res.status(200).json({order})
                }
            })
            .catch((err)=>{
                return res.status(500).json({err:err.name})
            })
            if(!found){
                return res.status(404).json({msg:"No Order With this id"})
            }

        }
}