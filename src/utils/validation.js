const validator = require("validator");
const signUpValidation = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
};
const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "about",
        "skills",
        "age",
        "gender",
    ];
    if (req.body.emailId && !validator.isEmail(emailId)) {
        throw new Error("Email id is not valid!");
    } else if (
        req.body.skills &&
        (!Array.isArray(req.body.skills) || req.body.skills.length > 10)
    ) {
        throw new Error("Number of skills should be less than 10!");
    } else if (
        (req.body.firstName && req.body.firstName.length >= 20) ||
        (req.body.lastName && req.body.lastName.length >= 20)
    ) {
        throw new Error("Name is too large!");
    } else if (req.body.age && (req.body.age <= 8 || req.body.age >= 120)) {
        throw new Error("Enter the age in a proper range!");
    } else if (
        req.body.gender &&
        req.body.gender.toLowerCase() !== "male" &&
        req.body.gender.toLowerCase() !== "female" &&
        req.body.gender.toLowerCase() !== "others"
    ) {
        throw new Error("Gender is not valid!");
    } else if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
        throw new Error("Photo URL is not valid!");
    } else if (req.body.about && req.body.about.length > 300) {
        throw new Error(
            "The number of words in the about section should be less than 300."
        );
    }

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
};

module.exports = { signUpValidation, validateEditProfileData };
