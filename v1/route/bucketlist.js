var bodyParser = require('body-parser');
var mongoose = require('mongoose');
let express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");
let methods = require('./method');



router.use(bodyParser.urlencoded({ extended: false }));


let bucketlist = require('../models/bucketlist');

router.delete("/:id/items/:item_id", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
            bucketlist.findOneAndUpdate({id: req.params.id},{$pull: {'items': { _id: req.params.item_id }}},
                function(err,model) {
                 if(err){
                  console.log(err);
                  return res.send(err);
              }
              return res.json({success:"Deleted Successfully"});
            });
        }
    })
})

router.put("/:id/items/:item_id", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
            bucketlist.update({'items._id': req.params.item_id},{'$set': {'items.$.name': req.body.name, 'items.$.date_modified': Date.now()}},
                function(err,model) {
                 if(err){
                  console.log(err);
                  return res.send(err);
              }
              return res.json({success: "Updated Successfully"});
            });
        }
    })
})

// router.get("/:id/items/:item_id", methods.verifyToken, (req,res) =>{
//     jwt.verify(req.token, 'secretkey',(err, result)=>{
//         if(err){
//           return  res.status(403).send({error: 'Token Expires Try logging in'});
//         }
//         else{
//             bucketlist.find({id: req.params.id}, (err, list)=>{
//                 if(list[0]['items'] < 1){
//                     res.send("No Record Found");
//                 }
//                 else{
//                     // res.json();
//                     let item_ids = list[0]['items'][0].name;
//                     // console.log(item_id);
//                     bucketlist.findById({item_ids: req.params.item_id},(err, lists)=>{
//                         if(lists < 1){
//                             res.send("No List Found");
//                         }
//                         else{
//                             res.json(lists);
//                         }
//                     })
//                 }
//             })
//         }
//     })
// })

router.get("/:id/items", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
            bucketlist.find({id: req.params.id}, (err, list)=>{
                if(list[0]['items'] < 1 || !list[0]['items']){
                    res.send("No Record Found");
                }
                else{
                  
                    res.json(list[0]['items']);
                }
            })
        }
    })
})

router.post("/:id/items", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
            req.body = {name: req.body.name, date_created: Date.now()}
            bucketlist.findOneAndUpdate({id: req.params.id}, {$push: {"items":req.body}},{safe: true, upsert: true, new: true},(err, list)=>{
                if(list < 1){
                    res.send("No Record Found");
                }
                else{
                    
                    res.json({success: 'Items added Successfuly',list});
                }
            })
        }
    })
})

router.delete("/:id", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
        bucketlist.findOneAndDelete({id: req.params.id},(err, list)=>{
                if(list < 1){
                    res.send("List Deleted Successfully");
                }
                else{
                res.send("List Deleted Successfully");
                }
            })
        }
    })
})

router.put("/:id", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
            bucketlist.findOneAndUpdate({id: req.params.id}, {$set: req.body,date_modified:Date.now()}, {new: true},(err, list)=>{
                    if(list < 1){
                        res.send("No Record Found");
                    }

                    res.json({success: 'List Updated Successfuly',list});
                })
            }
    })
})

router.get("/:id", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
            bucketlist.find({id: req.params.id}, (err, list)=>{
                    if(list < 1){
                        res.send("No Record Found");
                    }
                    res.json({list:list});
                })
            }
    })
})
router.get("/", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        // res.json(req.query);
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
            var page = parseInt(req.query.page)
            var limit = parseInt(req.query.limit)
            var q = req.query.q
            if(page && limit){
                var query = {}
                if(page < 0 || page === 0) {
                    response = {"error" : true,"message" : "invalid page number, should start with 1"};
                    return res.json(response)
                }
                query.skip = limit * (page - 1)
                query.limit = limit
                // Find some documents
                    bucketlist.find({},{},query,function(err,data) {
                    // Mongo command to fetch all data from collection.
                        if(err) {
                            response = {"error" : true,"message" : "Error fetching data"};
                        } else {
                            response = {"error" : false,"message" : data};
                        }
                        res.json(response);
                    });
            
            }
            
            else if(q){
                    bucketlist.find({name: req.query.q}, (err, list)=>{
                            if(list < 1){
                                res.json({error:true, message: "Record Not Found"});
                            }
                            res.json(list)
                        })
                    
                }
                else{
                    bucketlist.find({}, (err, list)=>{
                            if(list < 1){
                                res.send("No Record Found");
                            }
                            res.json(list)
                        })
                }
            
        }
    })
        
})

router.post("/", methods.verifyToken, (req,res) =>{
    jwt.verify(req.token, 'secretkey',(err, result)=>{
        // res.json(result);
        if(err){
          return  res.status(403).send({error: 'Token Expires Try logging in'});
        }
        else{
                if(!req.body){
                    return res.status(400).send('Request not found');
                }

                bucketlist.find().sort([['_id', 'descending']]).limit(1).exec(function(err, list){
                    var new_list = new bucketlist();
                        // console.log(list);
                        if (list != 0){
                            new_list.id = list[0].id + 1;
                        }else{
                            new_list.id = 1
                        }


                            new_list.name = req.body.name,
                            new_list.date_created = Date.now(),
                            new_list.date_modified = Date.now(),
                            new_list.created_by = result.user.username
                            bucketlist.find({name: req.body.name}, (err,data)=>{
                                if(data < 1){
                                    new_list.save((err,result)=>{
                                        if(err) throw err;
                                        res.send("New List Inserted");
                                })
                                }
                                else{
                                    res.send("Record Already Exist")
                                }
                            })

                                
                })
            }
    })
})

module.exports = router;
