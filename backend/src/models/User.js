const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id : int,
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowacase : true
    },
    password : {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
