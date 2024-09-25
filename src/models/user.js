const mongoose = require("mongoose");
const validator = require("validator");
const jwt=require("jsonwebtoken");
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
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
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid Email Address" + value);
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("password is not streong " + value);
                }
            },
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
            validate(value) {
                if (!validator.isURL(value))
                    throw new Error("Not a valid Image URL");
            },
        },
        about: {
            type: String,
            default: "This is the default description of the user",
        },
        skills: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v.length <= 10; // Adjust the maximum length as needed
                },
                message: "You can have a maximum of 10 skills.",
            },
        },
    },
    { timestamps: true }
);

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "dev@123", {
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordhash = user.password;
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordhash
    );
    return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
