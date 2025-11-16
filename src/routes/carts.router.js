import Cart from "../models/cart.model.js";
import express from "express";

const cartsRouter = express.Router();

cartsRouter.post("/", async (req,res)=>{
    try {
        const cart = new Cart(); //carrito vacio por default
        await cart.save(); //guarda en la bdd
        
        res.status(201).json({status: "success",payload: cart});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});

//agregar un producto al carrito
cartsRouter.post("/:cid/product/:pid", async (req,res)=>{
    try {
        const {cid,pid} = req.params;
        const {quantity = 1} = req.body; //aca recibo la cantidad (por defecto 1)
        const updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: {product: pid,quantity}}}, { new: true, runValidators: true});
    
        return res.redirect(`/carts/${cid}`); //redirecciona al carrito
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});

//traer los productos de un carrito
cartsRouter.get("/:cid", async (req,res)=>{
    try {
        const cid = req.params.cid;
        const cart = await Cart.findById(cid).populate("products.product"); //trae la informacion del producto en lugar de solo su id

        if(!cart) return res.status(404).json({status: "error", message: "carrito no encontrado"});

        res.status(200).json({status: "success",payload: cart.products});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});

//eliminar del carrito el producto seleccionado
cartsRouter.delete("/:cid/products/:pid", async (req,res)=>{
    try {
        const { cid, pid } = req.params;

        const updatedCart = await Cart.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        );

        if (!updatedCart) return res.status(404).json({ status: "error", message: "carrito no encontrado" });
        
        res.status(200).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


//eliminar todos los productos del carrito
cartsRouter.delete("/:cid", async (req,res)=>{
    try {
        const { cid } = req.params;

        const updatedCart = await Cart.findByIdAndUpdate(
            cid,
            { $set: { products: [] } }, // vaciar el array
            { new: true }
        );

        if (!updatedCart) return res.status(404).json({ status: "error", message: "carrito no encontrado" });
        
        res.status(200).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


export default cartsRouter;