const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {
    validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {
        const membershipType = req.body.membershipType;
        const { firstName, lastName, emailId } = req.user;
        const options = {
            amount: membershipAmount[membershipType] * 100, //Amount is in paise here.
            currency: "INR",
            receipt: "receipt#1",
            partial_payment: false,
            notes: {
                firstName,
                lastName,
                emailId,
                membershipType: membershipType,
            },
        };
        const order = await razorpayInstance.orders.create(options);
        const payment = new Payment({
            userId: req.user._id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            orderId: order.id,
            status: order.status,
            notes: order.notes,
        });
        const savedPayment = await payment.save();
        res.json({
            ...savedPayment.toJSON(),
            keyId: process.env.RAZORPAY_KEY_ID,
        });

        //Save it in the database
        // console.log(order);
        // res.json({ order });
    } catch (error) {
        console.error(error);
    }
});

// This request is webhook and it will be called by the razorpay therfore we must not use the userAuth here.
paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        const webhookSignature = req.get("X-Razorpay-Signature");
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );
        if (!isWebhookValid) {
            return res.status(400).send("Webhook is not valid");
        }

        // Update my payment status in the database

        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({
            orderId: paymentDetails.order_id,
        });
        payment.status = paymentDetails.status;
        await payment.save();

        // Update the user as premium
        console.log("User Id found using Payment Model :-> ", payment.userId);
        const user = await User.findOne({ _id: payment.userId });
        console.log("User Found:-> ", user);
        user.isPremium = true;
        console.log("Premiumness of the user:-> ", user.isPremium);
        console.log("User has been made premium"); // This is just for debugging purposes
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // return success response to the webhook
        /* if (req.body.event === "payment.captured") {
        }
        if (req.body.event === "payment.failed") {
        } */
        return res.status(200).json({ msg: "WebHook Received" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
module.exports = paymentRouter;
