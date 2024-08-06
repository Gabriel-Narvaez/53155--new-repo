import cartsServices from "../services/carts.services.js";
import ticketServices from "../services/ticket.services.js";
import error from "../errors/customErrors.js";

const createCart = async (req, res, next) => {
  try {
    const cart = await cartsServices.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    console.log(err);
    next(err); // Pasamos el error al middleware de manejo de errores
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsServices.addProductToCart(cid, pid);
    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateQuantityProductInCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      throw error.badRequestError("La cantidad debe ser un número mayor a cero");
    }

    const cart = await cartsServices.updateQuantityProductInCart(cid, pid, quantity);

    if (!cart) {
      throw error.notFoundError(`No se encontró el carrito con el id ${cid} o el producto con el id ${pid}`);
    }

    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteProductInCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsServices.deleteProductInCart(cid, pid);

    if (!cart) {
      throw error.notFoundError(`No se encontró el carrito con el id ${cid} o el producto con el id ${pid}`);
    }

    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getCartById = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getCartById(cid);

    if (!cart) {
      throw error.notFoundError(`No se encontró el carrito con el id ${cid}`);
    }

    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteAllProductsInCart = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const cart = await cartsServices.deleteAllProductsInCart(cid);

    if (!cart) {
      throw error.notFoundError(`No se encontró el carrito con el id ${cid}`);
    }

    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const purchaseCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getCartById(cid);

    if (!cart) {
      throw error.notFoundError(`No se encontró el carrito con el id ${cid}`);
    }

    // Obtener el total del carrito
    const total = await cartsServices.purchaseCart(cid);

    if (total <= 0) {
      throw error.badRequestError(`El carrito con el id ${cid} está vacío`);
    }

    // Crear el ticket
    const ticket = await ticketServices.createTicket(req.user.email, total);

    res.status(200).json({ status: "success", payload: ticket });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default {
  createCart,
  addProductToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
  getCartById,
  deleteAllProductsInCart,
  purchaseCart,
};
