import express from "express";
import Product from "../models/product.model.js"

const viewsRouter = express.Router();

//endpoints de handlebars. que vista mostrar
viewsRouter.get("/", async (req, res) => {
  try {
    const {limit = 10, page = 1} = req.query;
    const data = await Product.paginate({},{limit,page,lean: true})
    const products = data.docs;
    delete data.docs;

    const links = [];//cada link es un objeto

    for(let index = 1; index <= data.totalPages; index++){
      links.push({text: index, link: `?limit=${limit}&page=${index}`})
    }

    res.render("home",{ products,links });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// viewsRouter.get("/realtimeproducts", async (req, res) => {
//   res.render("realTimeProducts");
// });

export default viewsRouter;