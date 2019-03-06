let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");
let bcrypt = require('bcryptjs');
let methods = require('./method');


router.use(bodyParser.urlencoded({ extended: false }));
    let Auth = require('../models/auth');
        router.get("/logout", methods.verifyToken, (req, res, next )=>{
            jwt.verify(req.token, 'secretkey',(err, result)=>{
                // res.json(result);
                if(err){
                  return  res.status(403).send({error: 'Token Expires Try logging in'});
                }
                else{
                    //problem here
                    jwt.sign({user: result.user}, 'secretkey',{expiresIn: 86400},(err,token)=>{
                            return res.json({success: 'Logout Successfully',token: null});
                        })
                }
            })
        })
        router.post("/login", (req,res)=>{
           const data = req.body;
           let pass = bcrypt.hashSync(req.body.password,14);

                Auth.findOne({username: data.username},(err,user)=>{
                    if (!user || !bcrypt.compareSync(data.password , user.password)) {
                        return res.json({error: 'Incorrect Username / Password'});
                    }
                    else{
                        jwt.sign({user: user}, 'secretkey',{expiresIn: 6400},(err,token)=>{
                            return res.json({success: 'Login Successfully',token: token});
                        })
                       
                    }
                });
            
        })
        router.post("/signup", (req,res) =>{
           const data = req.body;

            if(!req.body){
                return res.status(400).send('Request not found');
            }

            Auth.find().sort([['_id', 'descending']]).limit(1).exec(function(err, userdata){
                let new_user = new Auth();
                let pass = bcrypt.hashSync(req.body.password,14);
                    // console.log(userdata[0].id);
                    if (userdata != 0){
                        new_user.id = userdata[0].id + 1;
                    }else{
                        new_user.id = 1
                    }
                        new_user.username = data.username,
                        new_user.password = pass,
                        new_user.date_joined = Date.now()
                        Auth.find({name: req.body.name}, (err, result)=>{
                            if(result < 1){

                                new_user.save((err,result)=>{
                                    if(!result){
                                        throw err;
                                    }
                                    else{
                                        res.send("New USer Inserted");
                                    }     
                                })
                            }
                            else{
                                res.send("User Already Exist")
                            }
                        })
                })
            })
module.exports = router;