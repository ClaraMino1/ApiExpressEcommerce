import express from "express";
import ProductManager from "../ProductManager.js";
import uploader from "../utils/uploader.js";
import Product from "../models/product.model.js"

const productsRouter = express.Router();

productsRouter.get("/", async (req,res)=>{
  try {
    const products = await Product.find();
    res.status(200).json({status: "success", payload: products});
  } catch (error) {
    res.status(500).json({status: "error", message: "error al recuperar los productos"});
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



























// const productManager = new ProductManager("./src/products.json");

// //concatena la ruta definida en app.js
// // Crear producto con imagen
// productsRoutes.post("/", uploader.single("file"), async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ message: "No se ha cargado ningún archivo" });

//     const title = req.body.title;
//     const price = req.body.price;
//     const thumbnail = "/img/" + req.file.filename;

//     await productManager.addProduct({ title, price, thumbnail });

//     // Obtener productos actualizados
//     const updatedProducts = await productManager.getProducts();

//     // Emitir actualización a todos los clientes conectados
//     const io = req.app.locals.io;
//     io.emit("productos", updatedProducts);

//     res.redirect("/realtimeproducts");
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Eliminar producto
// productsRoutes.delete("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     await productManager.deleteProductById(id);
//     const updatedProducts = await productManager.getProducts();

//     // Emitir actualización
//     const io = req.app.locals.io;
//     io.emit("productos", updatedProducts);

//     res.json({ message: "Producto eliminado correctamente" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default productsRoutes;