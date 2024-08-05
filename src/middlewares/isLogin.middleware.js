
import { request, response } from "express";
import error from "../errors/customErrors.js";

export const isLogin = async (req = request, res = response, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      throw error.unauthorizedError("Usuario no logueado");
    }
  } catch (err) {
    next(err);
  }
};
