const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // User should see all the user cards except
        //1) The card of himself
        //2) The card of the users who have sent him connection request
        //3) The card of the users who have accepted his connection request
        //4) Ignored people
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * 10;

        console.log("Fetching Feed of the Logged In User");
        //Find all connectionRequests that I have sent or received
        const connectionRequests = await connectionRequest
            .find({
                $or: [
                    {
                        fromUserId: loggedInUser._id,
                    },
                    {
                        toUserId: loggedInUser._id,
                    },
                ],
            })
            .select("fromUserId toUserId")
            .skip(skip)
            .limit(limit);

        console.log(
            "Connection Requests Fetched :- ",
            connectionRequests.length
        );

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        console.log("Fetching Users");

        const users = await User.find({
            $and: [
                {
                    _id: {
                        $nin: Array.from(hideUsersFromFeed),
                    },
                },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select("firstName lastName photoUrl about,skills");

        res.status(200).json({
            message: "Feed Fetched Successfully",
            data: { users },
        });
    } catch (error) {
        res.status(400).josn({
            message: error.message,
        });
    }
});

module.exports = userRouter;
