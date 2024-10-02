const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

//Get all the pending connection requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest
            .find({
                toUserId: loggedInUser._id,
                status: "interested",
            })
            .populate("fromUserId", ["firstName", "lastName"]);
        // .populate("fromUserId","firstName lastName")    //the above both are same as we can pass array as well as space separated strings.

        res.json({
            message: "Data fetched Successfully",
            data: connectionRequests,
        });
    } catch (error) {
        res.status(404).send("ERROR: " + error.message);
    }
});

module.exports = userRouter;
