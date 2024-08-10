import { userResponseDto } from "../dto/user-response.dto.js";
import { createToken } from "../utils/jwt.js";
import error from "../errors/customErrors.js";
import { logger } from "../utils/logger.js";

const register = async (req, res, next) => {
  try {
    res.status(201).json({ status: "success", msg: "Usuario Creado" });
  } catch (err) {
    logger.error(err);
    next(err); 
  }
};

const login = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw error.unauthorizedError("Credenciales incorrectas"); // Custom error para credenciales inválidas
    }

    const token = createToken(user);
    // Guardamos el token en una cookie
    res.cookie("token", token, { httpOnly: true });
    const userDto = userResponseDto(user);
    return res.status(200).json({ status: "success", payload: userDto, token });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const current = (req, res, next) => {
  try {
    if (!req.user) {
      throw error.unauthorizedError("Usuario no autenticado"); // Custom error para usuario no autenticado
    }

    return res.status(200).json({ status: "success", payload: req.user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const loginGoogle = async (req, res, next) => {
  try {
    if (!req.user) {
      throw error.unauthorizedError("No se pudo autenticar con Google");
    }

    return res.status(200).json({ status: "success", payload: req.user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw error.internalServerError("Error al cerrar sesión"); // Error personalizado si la sesión no se puede destruir
      }

      res.status(200).json({ status: "success", msg: "Sesión cerrada con éxito" });
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export default {
  register,
  login,
  current,
  loginGoogle,
  logout,
};