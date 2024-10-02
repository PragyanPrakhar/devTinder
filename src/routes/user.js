const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

const userSharableData = [
    "firstName",
    "lastName",
    "skills",
    "photoUrl",
    "age",
    "gender",
    "about",
];
//Get all the pending connection requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest
            .find({
                toUserId: loggedInUser._id,
                status: "interested",
            })
            .populate("fromUserId", [
                "firstName",
                "lastName",
                "skills",
                "photoUrl",
                "age",
                "gender",
                "about",
            ]);
        // .populate("fromUserId","firstName lastName")    //the above both are same as we can pass array as well as space separated strings.

        res.json({
            message: "Data fetched Successfully",
            data: connectionRequests,
        });
    } catch (error) {
        res.status(404).send("ERROR: " + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest
            .find({
                $or: [
                    {
                        toUserId: loggedInUser._id,
                        status: "accepted",
                    },
                    {
                        fromUserId: loggedInUser._id,
                        status: "accepted",
                    },
                ],
            })
            .populate("fromUserId", userSharableData)
            .populate("toUserId", userSharableData);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            data: data,
        });
    } catch (error) {
        res.status(404).send("ERROR: " + error.message);
    }
});

module.exports = userRouter;
