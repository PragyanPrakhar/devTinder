const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
    const userObj = req.body;
    console.log(req.body);
    //creating a new instance of the user model
    const user = new User(userObj);
    try {
        await user.save();
        res.send("User Added Successfully !!");
    } catch (e) {
        res.status(400).send("Error saving the user" + e.message);
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
