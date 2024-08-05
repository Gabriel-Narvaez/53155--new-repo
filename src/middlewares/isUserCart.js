import { request, response } from "express";
import error from "../errors/customErrors.js";

export const isUserCart = async (req = request, res = response, next) => {
  try {
    const { cid } = req.params;
    if (req.user.cart !== cid) throw error.unauthorizedError("El id del carrito no corresponde al usuario");

    next();
  } catch (err) {
    next(err);
  }
};
