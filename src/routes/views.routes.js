import express from "express";
import Product from "../models/product.model.js"
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

//endpoints de handlebars. que vista mostrar
viewsRouter.get("/", async (req, res) => {
  try {
    const {limit = 10, page = 1} = req.query;

    //crea siempre un carrito vacio
    const newCart = new Cart();
    await newCart.save();
    const cartId = newCart._id.toString();

    const data = await Product.paginate({},{limit,page,lean: true})
    const products = data.docs;
    delete data.docs;

    const links = [];//cada link es un objeto

    for(let index = 1; index <= data.totalPages; index++){
      links.push({text: index, link: `?limit=${limit}&page=${index}`})
    }

    res.render("home", {products,links,cartId});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", {
      products: cart.products,
      cartId: cid
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const cartId = req.query.cartId;

    const product = await Product.findById(pid).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", {
      product,
      cartId
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default viewsRouter;