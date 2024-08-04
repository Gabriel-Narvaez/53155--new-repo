// Importar el módulo 'fs' 
import fs from "fs";

// Variable para almacenar la lista de productos
let products = [];
// Ruta donde se guardan los datos de los productos
let pathFile = "./src/data/products.json";

// Agregar un nuevo producto
const addProduct = async (product) => {
  // Extraer los campos del objeto 'product'
  const { title, description, price, thumbnail, code, stock } = product;
  // Obtener los productos actuales
  await getProducts();
  // Crear un nuevo producto con un id único
  const newProduct = {
    id: products.length + 1,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status: true // Por defecto, el producto se establece como disponible
  };

  // Verificar si alguno de los campos del nuevo producto está indefinido
  if (Object.values(newProduct).includes(undefined)) {
    console.log("Todos los campos son obligatorios");
    return;
  }

  // Verificar si el producto ya existe en la lista por su código
  const productExists = products.find((product) => product.code === code);
  if (productExists) {
    console.log(`El producto ${title} con el código ${code} ya existe`);
    return;
  }

  // Agregar el nuevo producto a la lista de productos
  products.push(newProduct);

  // Guardar los productos actualizados en el archivo JSON
  await fs.promises.writeFile(pathFile, JSON.stringify(products));
};

// Obtener todos los productos o un número limitado de productos
const getProducts = async (limit) => {
  // Leer el archivo JSON que contiene los productos
  const productsJson = await fs.promises.readFile(pathFile, "utf8");
  products = JSON.parse(productsJson) || []; // Si el archivo está vacío, inicializar products como un array vacío

  // Si no se especifica un límite, devolver todos los productos
  if (!limit) return products;

  // Si se especifica un límite, devolver un número limitado de productos
  return products.slice(0, limit);
};

// Obtener un producto por su id
const getProductById = async (id) => {
  await getProducts(); // Obtener los productos actuales
  // Buscar el producto con el id proporcionado
  const product = products.find((product) => product.id === id);
  // Si no se encuentra el producto, imprimir un mensaje de error y retornar
  if (!product) {
    console.log(`No se encontró el producto con el id ${id}`);
    return;
  }

  // Imprimir el producto encontrado y devolverlo
  console.log(product);
  return product;
};

// Actualizar un producto por su id
const updateProduct = async (id, dataProduct) => {
  await getProducts(); // Obtener los productos actuales
  // Buscar el índice del producto en la lista por su id
  const index = products.findIndex((product) => product.id === id);
  // Actualizar los campos del producto con los datos proporcionados
  products[index] = {
    ...products[index],
    ...dataProduct,
  };

  // Guardar los productos actualizados en el archivo JSON
  await fs.promises.writeFile(pathFile, JSON.stringify(products));
};

// Eliminar un producto por su id
const deleteProduct = async (id) => {
  await getProducts(); // Obtener los productos actuales
  // Filtrar los productos y eliminar el que tenga el id proporcionado
  products = products.filter((product) => product.id !== id);
  // Guardar los productos actualizados en el archivo JSON
  await fs.promises.writeFile(pathFile, JSON.stringify(products));
};

// Exportar las funciones para su uso en otros módulos
export default {
  addProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
