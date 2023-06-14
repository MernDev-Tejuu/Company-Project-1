require('dotenv').config();
const express = require('express')
const app = express()
app.use(express.json())
//
const port = 4000 
app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
    
})
//
const mongoose = require('mongoose')
//Disclamer : Always create a env file outside src folder ,or else you have to write specific path name in require.('dotenv').config({path :'location'})
mongoose.connect(process.env.DB)
.then((resolve)=>{ 
    if(resolve)
    console.log("Mongoose connected ")
})
.catch(()=>{
    console.log("Mongoose failed ")
})


 
module.exports=app
//few things to keep in mind , .env file should be created outside src,after then make sure that npm i dotenv is installed, later on always save variable in caps like DB=hshhjlksdjlsd, lastly, call require('dotenv').config() on main index.js 