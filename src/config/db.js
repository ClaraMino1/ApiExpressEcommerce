import mongoose from "mongoose";

const connectMongoDB = async () =>{
  try {
    await mongoose.connect(process.env.CONNECTION_MONGODB);
    console.log("Conectado con MongoDB")
  } catch (error) {
    console.log("Error al conectar con mongoDB")
  }
};

export default connectMongoDB;