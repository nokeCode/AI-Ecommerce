const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id : Number,
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase : true
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

userSchema.pre('save', function(){
    this.updatedAt = Date.now();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
