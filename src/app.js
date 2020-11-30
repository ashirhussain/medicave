const express = require('express');
const path = require('path');
const admin = require('../routes/admin/admin');
const cors = require('cors');



const app =express();
app.use(express.json());
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
app.use('/admin', admin);

//Creating Server------------------
const PORT =process.env.PORT|| 5000;

app.listen(PORT,()=>{

    console.log(`Server Started on Port ${PORT}`)
});