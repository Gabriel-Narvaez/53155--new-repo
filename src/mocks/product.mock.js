import { fakerES as faker } from "@faker-js/faker";
import { productModel } from "../persistences/mongo/models/product.model.js";

export const generateProductsMocks = (amount) => {
    const products = [];
  
    for (let i = 0; i < amount; i++) {
      const product = {
        name: faker.commerce.productName(), // Nombre del producto
        description: faker.commerce.productDescription(), // Descripción del producto
        price: faker.commerce.price({ min: 1, max: 1000, dec: 2 }), // Precio del producto entre 1 y 1000
        category: faker.commerce.department(), // Categoría del producto
        sku: faker.string.uuid(), // SKU (Stock Keeping Unit) único
        image: faker.image.url(), // URL de una imagen aleatoria del producto
        stock: faker.number.int({ min: 0, max: 100 }), // Cantidad de stock entre 0 y 100
        rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }), // Calificación entre 0 y 5
        manufacturer: faker.company.name(), // Nombre del fabricante
        weight: faker.number.float({ min: 0.1, max: 5, precision: 0.01 }), // Peso en kg, con precisión de 0.01 kg
      };
  
      products.push(product);
    }
    productModel.insertMany(products);
  
    return products;
  };
  
  