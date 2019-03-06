const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a model

const bucketListSchema = new Schema({
    id: {type: Number, default: 1},
    name: {type:String, required: true},
    items:[{
        name: {type:String},
        date_created: {type: Date},
        date_modified: {type: Date},
        done: {type: Boolean}
    }],
    date_created: {type: Date},
    date_modified: {type: Date},
    created_by:{type: String}
});


const bucketList = mongoose.model("item",bucketListSchema);

module.exports = bucketList;