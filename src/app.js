const express = require('express');
const path = require('path');
const admin = require('../routes/admin/admin');
const customer = require('../routes/customer/customer');
const rider =require('../routes/rider/rider');
const seller =require('../routes/seller/seller');
const cors = require('cors');
const webpush = require("web-push");



const app =express();

app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
//Testing database--------------------
const db =require('../config/databse')
db.authenticate().then(()=>{
    console.log("Database is connected...")
}).catch((err)=> {
    console.log("Error"+err)
});
app.use(cors());
//-----------------------------------
//Main route
// app.use('/',(req,res)=>{
//     res.send("Hello World");
// })
//for admin routes
app.use('/admin', admin);

//for customer routes
app.use('/customer',customer)

//for rider routes
app.use('/rider',rider)

//for seller routes
app.use('/seller',seller)
//Creating Server------------------
const PORT =process.env.PORT|| 5000;

app.listen(PORT,()=>{

    console.log(`Server Started on Port ${PORT}`)
});