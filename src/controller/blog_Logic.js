const blog = require('../model/blog_Model')
const author = require('../model/author_Model')
const jwt  = require('jsonwebtoken')
const authTokenGenerator = require('./token')  
const mongoose = require("mongoose")
const create_Blog = async (req, res) => {
    const { _id } = req.decoded; // Get the _id from the decoded token
    const body = req.body; // Get the request body
    const { authorId, isPublished } = body; // Destructure authorId and isPublished from the body
    const mandatoryFields = ["title", "body", "authorId", "tags", "category", "isPublished"]; // Define the mandatory fields

    const missingFields = mandatoryFields.filter(field => !body.hasOwnProperty(field)); // Check for missing fields

    if (missingFields.length > 0) { // Handle missing fields
        return res.status(400).send({ message: `${missingFields} is mandatory` });
    }

    if (!mongoose.Types.ObjectId.isValid(authorId)) { // Validate authorId
        return res.status(400).send({ message: "authorId is Invalid" });
    }

    const finder = await author.findById(authorId); // Find the author by authorId

    if (!finder) { // Handle author not found
        return res.status(404).send({ message: `authorId Not Found` });
    }

    const { email } = finder; // Get the email from the finder

    if (email !== req.tokenId.email) { // Check if the email matches the email in the token
        return res.status(401).send({ message: `You don't have authority with this _id` });
    }

    if (isPublished === true) { // Check if the blog should be published
        const updation = await blog.findOneAndUpdate({ authorId }, { $set: { publishedAt: new Date().toISOString() } }); // Update the publishedAt field
        const { _id } = updation;
        console.log("Updating", _id);

        const token = await authTokenGenerator.authGeneratorBlog(req, res, _id); // Generate a new token
        return res.status(201).send({ message: `Blog has been Created`, Blog_Created: updation, token: token });
    }

    const creator = await blog.create(body); // Create the blog

    const token = await authTokenGenerator.authGeneratorBlog(req, res, creator._id); // Generate a new token
    return res.status(201).send({ message: `Blog has been Created`, Blog_Created: creator, token: token });
};

//-----------------------------------------------------------------------------
 
const get_All_Blogs = async (req, res) => {
    const query = req.query; // Get the query parameters

    if (Object.keys(query).length > 0) { // Check if there are query parameters
        const finder1 = await blog.find({ ...query, isPublished: true, isDeleted: false }); // Find blogs with the specified query parameters
        if (!finder1.length > 0) { // Handle data not found
            return res.status(404).send({ message: `Data Not Found` });
        }
        return res.status(200).send({ filtered_Blogs: finder1 }); // Return the filtered blogs
    }

    const finder = await blog.find({ isPublished: true, isDeleted: false }); // Find all published blogs
    if (!finder.length > 0) { // Handle data not found
        return res.status(404).send({ message: `Data Not Found` });
    }
    return res.status(200).send({ blogs: finder }); // Return all the blogs
};

//--------------------------------------------------------------------------------

const update_Blog = async (req, res) => {
    console.log(`Code reaching updateBlog`);
    const paramsId = req.params.blogId; // Get the blogId from the URL parameters
    const body = req.body; // Get the request body

    if (Object.keys(body).length <= 0) { // Check if the request body is empty
        return res.status(422).send({ message: 'Please Provide query in body' });
    }

    const finder = await blog.findOne({ _id: paramsId, isDeleted: false }); // Find the blog with the specified blogId
    if (finder === null) { // Handle document not found
        return res.status(404).send({ message: `Documents Not Found with this paramsId` });
    }
    const { email } = finder;

    if (req.tokenId.email !== email) { // Check if the logged-in user is authorized to edit the blog
        return res.status(401).send({ message: `you cannot access or edit others data` });
    }

    if (finder.isPublished === false) { // Handle blog updation when it is not published
        const updation = await blog.findOneAndUpdate(
            { _id: paramsId },
            { $set: { isPublished: true, publishedAt: new Date().toISOString(), ...body } },
            { new: true }
        );
        return res.status(200).send({ status: true, data: updation });
    }

    const updation2 = await blog.findOneAndUpdate(
        { _id: paramsId },
        { $set: body },
        { new: true }
    );

    return res.status(200).send({ message: `Data Has Been Updated`, Updated_Data: updation2 });
};

//-----------------------------------------------------------------------

const delete_Blog_Params = async (req, res) => {
    const _id = req.params.blogId; // Get the blogId from the URL parameters

    if (!mongoose.Types.ObjectId.isValid(_id)) { // Check if the _id is valid
        return res.status(400).send({ message: `_id is not valid` });
    }

    if (_id !== req.tokenId._id) { // Check if the logged-in user has authority to delete this _id
        return res.status(401).send({ message: `You don't have authority to delete this _id` });
    }

    const finder = await blog.findOne({ _id }); // Find the blog with the specified _id
    if (finder === null) { // Handle document not found
        return res.status(404).send({ message: `Data not found` });
    }

    if (finder.isDeleted === true) { // Check if the blog has already been deleted
        return res.status(422).send({ message: `This Id has already been deleted` });
    }

    const deletion = await blog.findOneAndUpdate(
        { _id },
        { $set: { isDeleted: true, deletedAt: new Date().toISOString() } },
        { new: true }
    );


    return res.status(200).send(deletion);
};


//-----------------------------------------------------------------------------

const delete_Blogs_Query = async (req, res) => {
    const query = req.query; // Get the query parameters from the request

    if (!Object.keys(query).length > 0) { // Check if query parameters are provided
        return res.status(400).send({ message: `Please provide query` });
    }

    const finder = await blog.findOne({ ...query, isDeleted: false }); // Find the blog with the specified query parameters

    if (finder === null) { // Handle document not found
        return res.status(404).send({ message: `Data not found` });
    }

    const updation = await blog.findOneAndUpdate(
        query,
        { $set: { isDeleted: true, deletedAt: new Date().toISOString() } },
        { new: true }
    );

    console.log(updation);
    return res.status(200).send({ deleted: updation });
};
module.exports.delete_Blogs_Query=delete_Blogs_Query
module.exports.delete_Blog_Params=delete_Blog_Params
module.exports.update_Blog=update_Blog
module.exports.get_All_Blogs=get_All_Blogs
module.exports.create_Blog=create_Blog