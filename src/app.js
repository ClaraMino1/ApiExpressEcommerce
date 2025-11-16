import express from "express";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";

//inicializar variables de entorno
dotenv.config();

const PORT = 8080;
const app = express();
app.use(express.json()); //permite recibir info en formato json
app.use(express.urlencoded({ extended: true }));

connectMongoDB();

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//endpoints
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.use("/", viewsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
