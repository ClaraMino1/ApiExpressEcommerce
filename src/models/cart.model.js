import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products:{
        type:[
            {
                Product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"}, //parecido a una foreanea
                quantity: {type: Number}
            }
        ],
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const Cart = mongoose.model("Cart",cartSchema);

export default Cart;