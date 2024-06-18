import fs from "fs";

// Variable global que almacenará los carritos
let carts = [];
// Ruta del JSON donde se guardan los datos de los carritos
const pathFile = "./src/data/carts.json"

// Obtener los carritos almacenados en el archivo JSON
const getCarts = async () => {
  // Leer el archivo JSON y parsear su contenido
  const cartsJson = await fs.promises.readFile(pathFile);
  carts = JSON.parse(cartsJson) || []; // Si el archivo está vacío, inicializar carts como un array vacío

  return carts;
}

// Crear un nuevo carrito
const createCart = async () => {
  await getCarts(); // Obtener los carritos existentes

  // Crear un nuevo carrito con un id único y sin productos inicialmente
  const newCart = {
    id: carts.length + 1,
    products: []
  };

  // Agregar el nuevo carrito al array carts
  carts.push(newCart);

  // Guardar los carritos actualizados en el archivo JSON
  await fs.promises.writeFile(pathFile, JSON.stringify(carts));

  return newCart;
}

// Obtener un carrito por su id
const getCartById = async (cid) => {
  await getCarts(); // Obtener los carritos existentes
  
  // Buscar el carrito con el id
  const cart = carts.find(c => c.id === cid);

  // Si no se encuentra el carrito, devolver mensaje de error
  if(!cart) return `No se encuentra el carrito con el id ${cid}`;

  // Devolver los productos del carrito encontrado
  return cart.products;
}

// Agregar un producto a un carrito
const addProductToCart = async (cid, pid) => {
  await getCarts(); // Obtener los carritos existentes
  
  // Buscar el índice del carrito en el array carts
  const index = carts.findIndex( c => c.id === cid);
  // Si el carrito no existe, devolver mensaje de error
  if(index === -1) return `No se encontró el carrito con el id ${cid}`;

  // Buscar si el producto ya existe en el carrito
  const productIndex = carts[index].products.findIndex(p => p.product === pid);
  // Si el producto ya existe en el carrito, incrementar su cantidad
  if (productIndex !== -1) {
    carts[index].products[productIndex].quantity += 1;
  } else {
    // Si el producto no existe en el carrito, agregarlo con cantidad 1
    carts[index].products.push({
      product: pid,
      quantity: 1
    });
  }

  // Guardar los carritos actualizados en el archivo JSON
  await fs.promises.writeFile(pathFile, JSON.stringify(carts));

  // Devolver el carrito modificado
  return carts[index];
}

// Exportar las funciones para su uso en otros módulos
export default {
  getCarts,
  createCart,
  getCartById,
  addProductToCart
}
