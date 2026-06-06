const mongoose = require('mongoose');

const CategorySchema  = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    parentCategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        default : null
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
});

CategorySchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;