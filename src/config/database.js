const mongoose = require("mongoose");
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://pragyanprakhar:SqaIfgVBCY01pbrF@namaste-node.usqfk.mongodb.net/devTinder"
    );
};
module.exports=connectDB;