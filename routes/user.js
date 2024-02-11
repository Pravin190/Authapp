

const express = require("express");

const router = express.Router();

const User = require("../models/usermodel");     // line no. 62            

// controller import

const {signup,login} = require("../controllers/Auth");
const { auth,isStudent,isAdmin} = require("../Middleware/auth");

//route mapping with controller

router.post("/signup",signup);
router.post("/login",login);


// testing route for middleware

router.get("/test",auth, (req,res) => {

    res.json({

            success : true,
            message : "Test Succesfull",

    });

});

// protected route for student

router.get("/student",auth, isStudent, (req,res) => {

    res.json({

            success : true,
            message : "welcome to protected route for student",

    });

});

// protected route for Admin

router.get("/admin",auth, isAdmin, (req,res) => {

    res.json({

            success : true,
            message : "welcome to protected route for Admin",

    });

});


// protected route for Email

router.get("/getEmail",auth, async (req,res) => {


    try{

        const id = req.user.id;
        console.log("id : " , id);

        const userdata = await User.findById(id);

        return res.status(200).json({

            success : true,
            data : userdata,
            message : "welcome to email route",

        });

    }catch(error){

        return res.status(500).json({

            success : false,
            message : "error while fetching id from user",

        });

    }


})

module.exports = router;

