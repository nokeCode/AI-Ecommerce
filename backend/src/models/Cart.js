const monggose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
    },
    quantity : {
        type : Number,
        required : true,
        min : 1
    },
    price : {
        type : Number,
        required : true,
        min : 0
    }
})

cartItemSchema.pre('save', function(next){
    this.price = this.quantity * this.price;
    next();
});

const CartItem = mongoose.model('CartItem', CartItemSchema);
module.exports = CartItem;

const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        unique : true
    },
    items : [CartItemSchema],
    totalPrice : {
        type : Number,
        default : 0,
        min : 0
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

cartSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;