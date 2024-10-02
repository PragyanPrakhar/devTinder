const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignore", "interested", "accepted", "rejected"],
                messgae: `{VALUE} is incorrect status type`,
            },
        },
    },
    { timestamps: true } 
);
//created a compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//This will be called just before everytime the connectionRequest will be save
connectionRequestSchema.pre("save", function (next) {   
    const connectionRequest = this;
    //check if fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Can't send Connection Request to YourSelf");
    }
    next();
});
const connectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);
module.exports = connectionRequestModel;
