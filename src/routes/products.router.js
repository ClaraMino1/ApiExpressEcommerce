import express from "express";
import ProductManager from "../ProductManager.js";
import uploader from "../utils/uploader.js";

const productsRoutes = express.Router();
const productManager = new ProductManager("./src/products.json");

//concatena la ruta definida en app.js
// Crear producto con imagen
productsRoutes.post("/", uploader.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No se ha cargado ningún archivo" });

    const title = req.body.title;
    const price = req.body.price;
    const thumbnail = "/img/" + req.file.filename;

    await productManager.addProduct({ title, price, thumbnail });

    // Obtener productos actualizados
    const updatedProducts = await productManager.getProducts();

    // Emitir actualización a todos los clientes conectados
    const io = req.app.locals.io;
    io.emit("productos", updatedProducts);

    res.redirect("/realtimeproducts");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar producto
productsRoutes.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await productManager.deleteProductById(id);
    const updatedProducts = await productManager.getProducts();

    // Emitir actualización
    const io = req.app.locals.io;
    io.emit("productos", updatedProducts);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productsRoutes;