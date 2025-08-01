const express = require("express")
const connectDB = require("./config/db");
connectDB();
const app = express()
const port = 3000
app.get("/",(req,res)=>{
    res.send("<h1>Suppot Desk</h1>")
})

app.listen(port,()=>{
    console.log("Server running...")
})