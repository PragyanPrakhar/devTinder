const express = require("express");
const app = express();

const {adminAuth}=require("./middlewares/auth");
// app.use("/",(req,res)=>{
//     res.send("Hello Pragyan !!");
// })

// app.get("/user", (req, res) => {
//     res.send({ firstName: "Pragyan", lastName: "Prakhar" });
// });

// app.post("/user",(req,res)=>{
//     console.log("Save data to the database");
//     res.send("Data has been saved successfully");
// })

// app.delete("/user",(req,res)=>{
//     console.log("Delete data from the database");
//     res.send("Data has been deleted successfully");
// })

// app.use("/test", (req, res) => {
//     res.send("Hello from the server");
// });

// app.use("/admin", (req, res, next) => {
//     const token = "xyz";
//     const isAuthorized = token === "xyz";
//     if (isAuthorized) {
//         next();
//     } else {
//         res.send("Unauthorized Access");
//     }
// });

app.use("/admin",adminAuth);
app.get("/admin/getAllData",(req,res)=>{
    res.send("Get All Data");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
