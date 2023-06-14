const author = require('../model/author_Model')
const jwt = require('jsonwebtoken')
const authTokenGenerator = require('./token')  
 
const create_Author = async(req,res)=>{
try{//Accessed Data from request body...    
    const body = req.body
//Applying Required Fields before moving to next steps    
    const reqFields = ["fname","lname","title","email","password"]
    for(i=0;i<reqFields.length ; i++){
    //Suitable Error Message, If required field is not present    
        if(!body.hasOwnProperty(reqFields[i]))
    return res.status(400).send({message : `${reqFields[i]} is Mandatory`})    
    }
//Alll Reqfields are Present..
//---------------------------------------------------------------------------
//Email Validation,to verify whether email is valid or not using regex    
    const {email,isPublished}=body
    req.email = email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email.match(emailRegex))
    return res.status(400).send({msg : `emailId is invalid`})
//Email validation passed...
//Checking Whether Email already exist in database or not ..

    const emailFinder = await author.findOne( {email})
    if(emailFinder)
    return res.status(422).send({message :  `Email has already Registered before`})
    
   const token = await  authTokenGenerator(req,res,email)
    
    console.log(token)
//Moving ahead !! Now, all Validation has passsed...
    const creator = await author.create(body)
    return res.status(201).send({Data_Created : creator,token:token})
}
catch(err){
    return res.status(500).send({msg : `Internal Error [${err.message}]`})
}
}

const getAuthor = async(req,res)=>{
    const _id = req.finder  
    console.log(process.env.SECRETEKEY)  
    const token = await jwt.sign({_id},process.env.SECRETEKEY)   
    req.author_Token = token
    return res.status(200).send({author : token})
}

module.exports.getAuthor=getAuthor
module.exports.create_Author=create_Author