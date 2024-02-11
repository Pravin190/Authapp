

const mongoose = require("mongoose");
require("dotenv").config();

 const dbconnect = () => {

     mongoose.connect(process.env.MongoDB_URL)
    .then( () => {

        console.log("DB connect successfully")

    })
    .catch((error) => {

        console.log("DB not connect")
        process.exit(1);
    }); 
}

module.exports = dbconnect;