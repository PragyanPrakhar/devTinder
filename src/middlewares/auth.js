const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    // Read the token from req.cookies.json
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is not valid !");
        }
        const decodedObj = await jwt.verify(token, "dev@123");
        console.log("Validating the user");
        //validate the user
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User Not Found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("ERROR :" + error.message);
    }
};
module.exports = { userAuth };
