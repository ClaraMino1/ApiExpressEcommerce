import express from "express";
import ProductManager from "../ProductManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

//endpoints de handlebars. que vista mostrar
viewsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

export default viewsRouter;