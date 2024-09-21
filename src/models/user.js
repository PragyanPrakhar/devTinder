const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength:3,
            maxLength:50,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender Data is not Valid");
                }
            },
        },
        photoUrl: {
            type: String,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFCm6U-R7Dh4WAGASSJFN9RaPTnxmDeV1cVqitzJ1yXslCORiVstDy8rB0YgI5YCRkCJo&usqp=CAU",
        },
        about: {
            type: String,
            default: "This is the default description of the user",
        },
        skills: {
            type: [String],
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
