const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
connectDB()
    .then(() => {
        console.log("Connection Established Successfully");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((e) => {
        console.log("Error Occured while connecting to Database !!");
    });

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Pragyan",
        lastName: "Prakhar",
        emailId: "pragyan@gmail.com",
        password: "pass@123",
    };
    //creating a new instance of the user model
    const user = new User(userObj);
    try {
        await user.save();
        res.send("User Added Successfully !!");
    } catch (e) {
        res.status(400).send("Error saving the user" + e.message);
    }
});
