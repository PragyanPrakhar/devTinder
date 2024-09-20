 const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAuthorized = token === "xyz";
    if (isAuthorized) {
        next();
    } else {
        res.send("Unauthorized Access");
    }
};
module.exports={adminAuth}
