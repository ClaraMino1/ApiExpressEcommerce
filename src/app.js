import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.router.js";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";

//inicializar variables de entorno
dotenv.config();

const PORT = 8080;
const app = express();
app.use(express.json()); //permite recibir info en formato json

connectMongoDB();

//endpoints
app.use("/api/products",productsRouter)

// const productManager = new ProductManager("./src/products.json");


// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // Handlebars
// app.engine("handlebars", engine());
// app.set("view engine", "handlebars");
// app.set("views", "./src/views");

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// // Socket.IO
// const io = new Server(httpServer);

// // guardamos io en app.locals para poder usarlo en cualquier router
// app.locals.io = io;

// // rutas
// app.use("/", viewsRouter);

// // conexión socket
// io.on("connection", async (socket) => {
//   console.log("Cliente conectado:", socket.id);

//   const products = await productManager.getProducts();
//   socket.emit("productos", products);
// });
