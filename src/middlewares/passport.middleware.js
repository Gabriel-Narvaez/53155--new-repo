import { request, response } from "express";
import passport from "passport";
import error from "../errors/customErrors.js";

export const passportCall = (strategy) => {
  return async (req = request, res = response, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return next(error.unauthorizedError(info.message ? info.message : info.toString()));

      req.user = user;

      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req = request, res = response, next) => {
    try {
      if (!req.user) throw error.unauthorizedError("No autorizado");
      if (req.user.role !== role) throw error.forbiddenError("No tienes permiso");

      next();
    } catch (err) {
      next(err);
    }
  };
};
