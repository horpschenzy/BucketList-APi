let jwt = require('jsonwebtoken')

module.exports.verifyToken = function verifyToken(req, res, next){

    //GEt Header Value
        const bearerHeader = req.headers["authorization"]

    //Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined'){

            //Split at space
                const bearer = bearerHeader.split(" ")
            //Get Token From array
                const bearerToken = bearer[1];
            // Set The Token
                req.token = bearerToken;
                // req.user = user;
                next();
        }
        else{
            res.json({error: 'Token Not Found... Try logging in OR create a new account'})
        }
}
