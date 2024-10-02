const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;
            const allowedStatus = ["ignored", "interested"];
            if (!allowedStatus.includes(status)) {
                return res
                    .status(400)
                    .json({ message: "Invalid status type" + status });
            }
            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(400).json({ message: "User Not Found !" });
            }

            //If there is any existing connectionRequest
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });

            if (existingConnectionRequest) {
                return res
                    .status(400)
                    .json({ message: "Connection Request Already Exists !" });
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectionRequest.save();
            res.json({
                message:
                    req.user.firstName + " is " + status + "in "+ toUser.firstName,
                data,
            });
        } catch (error) {
            res.status(400).send("ERROR" + error.message);
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            //from Hello Ma'am to Sakshi Ma'am
            const { _id } = req.user;
            console.log("_id of the user is", _id.toString());
            const { status, requestId } = req.params;
            console.log("request_id of the user is ", requestId);
            //validating the status of the user
            const allowedStatus = ["accepted", "rejected"];
            if (!allowedStatus.includes(status)) {
                return res
                    .status(400)    
                    .json({ message: "Invalid status type" + status });
            }
            // loggedIn user must be of toUserId
            // status -> interested
            // requestId should be valid
            console.log("Logged in user ID: ", _id);
            console.log("Request ID: ", requestId);

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: _id,
                // toUserId: new ObjectId(loggedInUser._id),
                status: "interested",
            });
            console.log("Connection Request", connectionRequest);
            if (!connectionRequest) {
                return res.status(404).json({
                    message: "Connection Request Not Found !",
                });
            }

            connectionRequest.status = status;
            const data = await connectionRequest.save();
            res.json({
                message: "Connection Request Updated Successfully !",
                data,
            });
        } catch (error) {
            res.status(400).send("ERROR in Review Request " + error.message);
        }
    }
);

module.exports = requestRouter;
