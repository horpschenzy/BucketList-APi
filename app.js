let express = require("express");
let jwt = require("jsonwebtoken");
let app = express();
let mongoose = require('mongoose');

if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
   
   }else {
   let db = ('mongodb://localhost/bucketlist');
    mongoose.connect(db, function(err){ //db = 'mongodb://localhost/yourdb'
     if(err){
      console.log(err);
     }else {
      console.log('mongoose connection is successful on: ' + db);
     }
    });
   }
let auth = require('./route/auth');
let bucketlist = require('./route/bucketlist');

app.use(express.static('public'));
app.use('/auth',auth);
app.use('/bucketlist', bucketlist);



const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`You are listening to port ${PORT}`);
