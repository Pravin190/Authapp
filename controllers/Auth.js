
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// signup route handler
exports.signup = async(req,res) => {

    try{
        
        // get data
        const {name,email,password,role} = req.body;

        // check if user exist

        const userExist = await User.findOne({email});

        if(userExist){

            return res.status(409).json({

                success : false,
                message : "user already exist",

            });

        }

        // secured password

        let hashedPassword;

        try{                            // hash (password, 10) means it return 2 things => (data,round)
            hashedPassword = await bcrypt.hash(password,10);

            console.log(hashedPassword);


        }catch(error) {

            return res.status(500).json({

                success : false,
                message : "error in hashing password",

            });

        }

        // create entry into DB

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            role
        });

        return res.status(201).json({

            success : true,
            data : user,
            message : "entry into DB successfull..."

        })

    }
    catch(error) {

        console.log("user cannot be register, plz try some later...",error);

        return res.status(500).json({
            success : false,
            message : "error while registering, plz try later.."


        })


    }
    


}


// login 

exports.login = async(req,res) => {

    try{


        const {email,password} = req.body;

        // empty

        if(!email || !password){

            return res.status(400).json({

                success : false,
                message : "please fill all the fields",

            });

        }

        // check for register user

        let user = await User.findOne({email});

        if(!user){


            return res.status(401).json({

                success : false,
                message : "user does not exist",


            });

        }

         // compare/verify password and genearate JWT Token

         const payload = {
            email : user.email,
            id : user._id,
            role : user.role,
        };

        console.log("Entered password:", password);
        console.log("Stored hashed password:", user.password);
        //password comapre

        const ispassword = await bcrypt.compare(password,user.password);
        if(ispassword){

            // genearate token

            let token = jwt.sign(payload,
                                process.env.JWT_Secret,{

                                        expiresIn : "2hr",
                                    });


        user = user.toObject();
        user.token = token;
        user.password = undefined;      // hum db mai kuch change nhi kr rahe yaha bs user mai token pass kr rahe hai aur password => undefined kr diya kui ki hacker ko password ke baremai pta na chale...


        const options = {
            expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),       //3 * 24 means 3 din * 24 hr
            httpOnly : true,
        }

        res.cookie("token",token,options).status(200).json({
            success : true,
            token,
            user,
            message:"User logged in successfully"
        });

        //  res.status(200).json({
        //     success : true,
        //     token,
        //     user,
        //     message:"User loged in successfully"
        // });

    }else {
        // password not match
        return res.status(403).json({
            success : false,
            message : "Password does not match",
        })
    }
        
    }catch(error) {

        return res.status(403).json({

            success : false,
            message : "login failure..."        

        })

    }
    
}














