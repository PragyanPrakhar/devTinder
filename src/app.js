const express = require("express");
const app = express();

// app.use("/",(req,res)=>{
//     res.send("Hello Pragyan !!");
// })

app.get("/user", (req, res) => {
    res.send({ firstName: "Pragyan", lastName: "Prakhar" });
});

app.post("/user",(req,res)=>{
    console.log("Save data to the database");
    res.send("Data has been saved successfully");
})

app.delete("/user",(req,res)=>{
    console.log("Delete data from the database");
    res.send("Data has been deleted successfully");
})

app.use("/test", (req, res) => {
    res.send("Hello from the server");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
