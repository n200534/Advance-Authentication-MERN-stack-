const express=require('express');
const mongoose=require('mongoose')
const router=require('./routes/userroutes');
const cors=require("cors")
const cookieParser=require('cookie-parser')
const bodyParser=require("body-parser")

//mongo connection 
//middle ware
var app=express();

app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(cors());
app.use(cookieParser());
app.use('/api',router)
mongoose.connect("mongodb+srv://amavarapuakshaykumar:FzqP7r7X2HDAotJg@cluster0.04hiju4.mongodb.net/users?retryWrites=true&w=majority/").then(()=>{
    console.log("Database coneccted")
}).catch((err)=>{
    console.log("error in connecting to the database")
})

app.listen(1000,()=>{
    console.log("server is running on the poert 1000")
})
