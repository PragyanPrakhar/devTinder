const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
        Destination: {
            /* required */
            CcAddresses: [
                /* more items */
            ],
            ToAddresses: [
                toAddress,
                /* more To-email addresses */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: "<h1>This is the email body.</h1>",
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is the text format",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Hello From SES",
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};

const run = async (subject,body) => {
    const sendEmailCommand = createSendEmailCommand(
        "pragyan.gla@gmail.com",
        "pragyanprakhar@gmail.com"
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        console.log("Error in sending email is :-> ", caught);
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
// export { run };
module.exports = { run };