import productsServices from "../services/products.services.js";
import error from "../errors/customErrors.js";

const getAll = async (req, res, next) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        price: sort === "asc" ? 1 : -1,
      },
      lean: true,
    };

    // Filtrar por status
    if (status) {
      const products = await productsServices.getAll({ status: status }, options);
      return res.status(200).json({ status: "success", products });
    }

    // Filtrar por category
    if (category) {
      const products = await productsServices.getAll({ category: category }, options);
      return res.status(200).json({ status: "success", products });
    }

    // Obtener todos los productos
    const products = await productsServices.getAll({}, options);

    res.status(200).json({ status: "success", products });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productsServices.getById(pid);

    if (!product) {
      throw error.notFoundError(`Producto con el id ${pid} no encontrado`);
    }

    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const product = req.body;

    if (!product.name || !product.price) {
      throw error.badRequestError("El nombre y el precio del producto son obligatorios");
    }

    const newProduct = await productsServices.create(product);

    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const productData = req.body;

    if (!productData.name || !productData.price) {
      throw error.badRequestError("El nombre y el precio del producto son obligatorios para actualizar");
    }

    const updateProduct = await productsServices.update(pid, productData);

    if (!updateProduct) {
      throw error.notFoundError(`Producto con el id ${pid} no encontrado`);
    }

    res.status(200).json({ status: "success", payload: updateProduct });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productsServices.deleteOne(pid);

    if (!product) {
      throw error.notFoundError(`Producto con el id ${pid} no encontrado`);
    }

    res.status(200).json({ status: "success", payload: "Producto eliminado" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  getAll,
  getById,
  update,
  deleteOne,
  create,
};
