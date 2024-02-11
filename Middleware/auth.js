
const jwt = require("jsonwebtoken");
require("dotenv").config();

// next se hum next middleware pr jayenge jayse ki pahile auth pr jayega, fir next() call krne or isStudent pr , fir isAdmin pr jayega...
// means next se hum routes mai ordering kr rahe hai pahile auth middleware call hoga, then isStudent , then isAdmin

exports.auth = (req,res,next) => {

    try{

        console.log("cookie : " , req.cookies.token);
        console.log("body : " , req.body.token);
        console.log("Header", req.header("Authorization"));
        // pending : other way to fetch token

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        // check empty case

        if(!token || token === undefined){

            return res.status(401).json({

                success : false,
                message : "token missing",

            });

        }

        console.log("token is " , token);

            // verify the token 
            // token ko verify krke usmai object ki form jo data hai wo decode mai save kiya
            // means token mai payload(decode) mai jo data tha use save kiya req.user mai..

        try{

            const decode = jwt.verify(token,process.env.JWT_Secret);

            req.user = decode;  // this bcoz req.user mai role pda hai...
                
            // success case managae in routes(user.js)


        }catch(error){

            return res.status(401).json({

                success : false,
                message : "token is invalid",

            });

        }

        next();

    }catch(error){

        return res.status(401).json({

            success : false,
            message : "something went wrong while veryfying the token",

        });

    }



}


exports.isStudent = (req,res,next) => {


    try{

        // check the role

        if(req.user.role !== "Student"){

            return res.status(401).json({

                success : false,
                message : "this is protected route for student you cannot access it..",

            });

        }

         // success case managae in routes(user.js)


        next();


    }catch(error){

        return res.status(500).json({

            success : false,
            message : "user role not matching",

        });

    }
}


exports.isAdmin = (req,res,next) => {


    try{

        // check the role

        if(req.user.role !== "Admin"){

            return res.status(401).json({

                success : false,
                message : "this is protected route for Admin you cannot access it..",

            });

        }

         // success case managae in routes(user.js)


        next();


    }catch(error){

        return res.status(500).json({

            success : false,
            message : "user role not matching",

        });

    }
}

