const cron = require("node-cron");
const connectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
cron.schedule("19 20 * * *", async () => {
    //Send Emails to all people who got request the previous day
    try {
        const yerstday = subDays(new Date(), 1);
        const yerstdayStart = startOfDay(yerstday);
        const yerstdayEnd = endOfDay(yerstday);
        const pendingRequests = await connectionRequestModel
            .find({
                status: "interested",
                createdAt: {
                    $lt: yerstdayEnd,
                    $gte: yerstdayStart,
                },
            })
            .populate("fromUserId toUserId");
        //we have used set because we don't want duplicate email ids.
        const listOfEmails = [
            ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
        ];
        // This is the synchronous(blocking) way of sending emails , Like if we will be having the millions of users then we should use queues.
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run(
                    "New Friend Request Pending for " +
                        email +
                        " Please check your account"
                );
                console.log("Sending email to", email);
            } catch (error) {
                console.error("Error sending email to", email);
            }
            //send email to each email id
        }
    } catch (error) {
        console.error(error);
    }
    // console.log("Hello World" + new Date());
});
