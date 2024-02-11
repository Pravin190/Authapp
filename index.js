const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

// cookie-parser to fetch token
const cookieParser = require("cookie-parser");
app.use(cookieParser()); 

app.use(express.json());

//database import

const dbconnect = require("./config/database");

dbconnect();

//routes import

const user = require("./routes/user");

app.use("/api/v1",user);

//activate

app.listen(PORT,() => {

    console.log(`server run at ${PORT}`);

})

// default route

app.get("/",(req,res) => {

    res.send("<h1>hello home page</h1>");

})