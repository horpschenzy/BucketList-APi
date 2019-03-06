const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a model

const userSchema = new Schema({
    id: {type: Number, default: 1},
    username: {type:String, required: true, unique: true},
    password: {type:String, required:true},
    date_joined: {type:Date}
});


const user = mongoose.model("user",userSchema);

module.exports = user;