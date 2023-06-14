const jwt = require('jsonwebtoken')
const author = require('../model/author_Model')

const authGenerator = async (req, res, id) => {
    const token = jwt.sign({ email: id }, process.env.SECRETEKEY); // Generate a JWT token using the provided id
    const verify = jwt.verify(token, process.env.SECRETEKEY); // Verify the generated token

    return token; // Return the generated token
};

const authGeneratorBlog = async (req, res, id) => {
    const token = jwt.sign({ _id: id }, process.env.SECRETEKEY); // Generate a JWT token using the provided id
    const verify = jwt.verify(token, process.env.SECRETEKEY); // Verify the generated token
    console.log(verify); // Log the verification result (optional)

    return token; // Return the generated token
}

    
    
module.exports.authGeneratorBlog=authGeneratorBlog
module.exports.authGenerator=authGenerator         