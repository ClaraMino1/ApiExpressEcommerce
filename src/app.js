import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";
import viewsRouter from "./routes/views.routes.js";
import productsRoutes from "./routes/products.router.js";

const app = express();
const PORT = 8080;
const productManager = new ProductManager("./src/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Socket.IO
const io = new Server(httpServer);

// guardamos io en app.locals para poder usarlo en cualquier router
app.locals.io = io;

// rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRoutes);

// conexión socket
io.on("connection", async (socket) => {
  console.log("Cliente conectado:", socket.id);

  const products = await productManager.getProducts();
  socket.emit("productos", products);
});
