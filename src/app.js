const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { signUpValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

app.use(express.json());

//SignUp
app.post("/signup", async (req, res) => {
    try {
        //validation
        signUpValidation(req);

        const { firstName, lastName, email, password } = req.body;
        //Hashing a password
        const HashedPassword = await bcrypt.hash(password, 10);
        console.log(HashedPassword);

        const user = new User({
            firstName,
            lastName,
            email,
            password: HashedPassword,
        });

        await user.save();
        res.send("User Added Successfully !!");
    } catch (e) {
        res.status(400).send("Error saving the user" + e.message);
    }
});

//Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        //validate whether the email id provided by the user is valid or not.
        if (!validator.isEmail(email)) {
            throw new Error("Invalid credentials");
        }
        //Check whether the email is present or not in the database
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        //Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.send("User Login Successful");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

// Get user by email
app.get("/user", async (req, res) => {
    const email = req.body.email;
    try {
        const users = await User.find({ email: email });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Error fetching user");
    }
});

//Feed API - GET /feed - get all users from database.
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        console.log(err);
    }
});

//delete user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted Successfully");
    } catch (error) {
        res.status(400).send("Error deleting user");
    }
});

//update data of the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    console.log(userId);
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update Not Allowed");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            //to enable validate function for the patch request too.
            runValidators: true,
        });
        console.log(user);
        res.send("User Updated Successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error updating user" + error.message);
    }
});

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
