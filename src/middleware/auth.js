const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const author = require('../model/author_Model')
const mongoose = require('mongoose')

// Validation before creating author creation
const authentication = async (req, res, next) => {
    try {
        const { email, password } = req.body; // Get email and password from request body

        if (!Object.keys(req.body).length > 0) { // Validate if the request body is not empty
            return res.status(400).send({ message: `[Please Fill email and password]` });
        }

        const finder = await author.findOne({ email }); // Find the user by email in the database

        if (finder === null) { // Handle user not found
            return res.status(404).send({ message: `[User not found]` });
        }

        const verifyPassword = await bcrypt.compare(password, finder.password); // Compare the provided password with the stored password

        if (!verifyPassword) { // Handle invalid password
            return res.status(400).send({ message: `Password is Invalid` });
        }

        req.finder = finder; // Store the user object in the request object

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(500).send(`Internal Error --> [${err.message}]`); // Handle internal server error
    }
};



const authentication1 = (req, res, next) => {
    // Get the token from the x-api-key header
    const key = req.header('x-api-key');

    // Validate if the token exists
    if (!key) {
        return res.status(400).send({ message: `Please add the token in the x-api-key header` });
    }
    
    // Verify the token using jwt.verify()
    const keyVerify = jwt.verify(key, process.env.SECRETEKEY, (err, decoded) => {
        // Handle verification errors
        if (err) {
            return res.status(401).send({ message: `Unauthorized author` });
        }

        // Store the decoded token in the request object
        req.decoded = decoded;
    });

    // Retrieve the tokenId from the decoded token
    const tokenId = req.decoded;
    
    // Store the tokenId in the request object
    req.tokenId = tokenId;
    
    console.log("Auth-->", tokenId);

    next(); // Proceed to the next middleware or route handler
};


//   -------------------------------------------------------------------------------
const authentication2 = (req, res, next) => {
    try {
        const paramsId = req.params.blogId; // Get the blogId from the request params
        if (!mongoose.Types.ObjectId.isValid(paramsId)) { // Validate if the paramsId is a valid ObjectId
            return res.status(400).send({ message: `ParamsId Is Invalid` });
        }
        
        const key = req.header('x-api-key'); // Get the token from the x-api-key header
        console.log(key);

        if (!key) { // Validate if the token exists
            return res.status(400).send({ message: `Please add token in x-api-key header` });
        }
        
        jwt.verify(key, process.env.SECRETEKEY, (err, decoded) => { // Verify the token using jwt.verify()
            if (err) { // Handle verification errors
                return res.status(401).send('Unauthorized Token');
            }
            req.decoded = decoded; // Store the decoded token in the request object
            console.log(req.decoded);
        });

        const tokenId = req.decoded; // Retrieve the tokenId from the decoded token
        req.tokenId = tokenId; // Store the tokenId in the request object

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(500).send({ msg: `Internal Error [${err.message}]` });
    }
};


//------------------------------------------------------------------------------

module.exports.authentication1=authentication1
module.exports.authentication2=authentication2
module.exports.authentication=authentication