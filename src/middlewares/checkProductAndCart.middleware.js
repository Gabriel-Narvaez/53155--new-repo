import { request, response } from "express";
import productsServices from "../services/products.services.js";
import cartsServices from "../services/carts.services.js";
import error from "../errors/customErrors.js";

export const checkProductAndCart = async (req = request, res = response, next) => {
  try {
    const { cid, pid } = req.params;
    const product = await productsServices.getById(pid);
    const cart = await cartsServices.getCartById(cid);

    if (!product) return next(error.notFoundError(`No se encontró el producto con el id ${pid}`));
    if (!cart) return next(error.notFoundError(`No se encontró el carrito con el id ${cid}`));

    next();
  } catch (err) {
    next(err); // Maneja otros posibles errores que no sean de entidad no encontrada
  }
};
