import express from "express";
//import uploader from "../utils/uploader.js";
import Product from "../models/product.model.js"

const productsRouter = express.Router();

productsRouter.get("/", async (req,res)=>{
  try {
    const { limit = 10 , page = 1 } = req.query;

    const data = await Product.paginate( {},{ limit,page } ); //filtros, congif de paginacion

    const products = data.docs;
    delete data.docs;

    res.status(200).json({status: "success", payload: products, ...data});
  } catch (error) {
    res.status(500).json({status: "error", message: "error al recuperar los productos"});
  }
});


productsRouter.get("/:pid", async (req,res)=>{
  try {
    const pid = req.params.pid;

    const product = await Product.findById(pid);

    if(!product) return res.status(404).json({status: "error", message: "Producto no encontrado"});

    res.status(200).json({status: "success", payload: product});

  } catch (error) {
    res.status(500).json({status: "error", message: "error al obtener el producto"});
  }
});

productsRouter.post("/", async (req,res)=>{
  try {
    const newProduct = req.body; //agarro las propiedades que se pasan por post

    const product = new Product(newProduct); //creo el modelo

    await product.save(); //sube a la bdd

    res.status(201).json({status: "success", payload: product});
  } catch (error) {
    res.status(500).json({status: "error", message: "error al crear el producto"});
  }
});

productsRouter.put("/:pid", async (req,res)=>{
  try {
    const pid = req.params.pid;
    const updates = req.body; //agarro las propiedades que se pasan por post

    const updatedProduct = await Product.findByIdAndUpdate(pid, updates,{new: true,runValidators:true}); //devuelve la informacion ya actualizada segun las validaciones del modelo

    if(!updatedProduct) return res.status(404).json({status: "error", message: "Producto no encontrado"});

    res.status(200).json({status: "success", payload: updatedProduct});

  } catch (error) {
    res.status(500).json({status: "error", message: "error al modificar el producto"});
  }
});

productsRouter.delete("/:pid", async (req,res)=>{
  try {
    const pid = req.params.pid;
    const deletedProduct = await Product.findByIdAndDelete(pid);

    if(!deletedProduct) return res.status(404).json({status: "error", message: "Producto no encontrado"});

    res.status(200).json({status: "success", payload: deletedProduct});
    
  } catch (error) {
    res.status(500).json({status: "error", message: "error al eliminar el producto"});
  }
});

export default productsRouter;
