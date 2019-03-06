let express = require("express");
let jwt = require("jsonwebtoken");
let app = express();
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bucketlist', {useNewUrlParser: true});

let auth = require('./route/auth');
let bucketlist = require('./route/bucketlist');

app.use(express.static('public'));
app.use('/auth',auth);
app.use('/bucketlist', bucketlist);



const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`You are listening to port ${PORT}`);
