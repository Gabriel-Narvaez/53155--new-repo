import mongoose from "mongoose";

const urlDb = "mongodb+srv://admin:admin123456@e-commerce.1eezjw0.mongodb.net/e-commerce";

export const connectMongoDB = async () => {
  try {
    // Conexión con la base de datos
    mongoose.connect(urlDb);
    console.log("Mongo DB Conectado");
  } catch (error) {
    console.log(error);
  }
};