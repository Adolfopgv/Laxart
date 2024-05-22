const Product = require("../models/productModel");

//const uploadProduct

const uploadProduct = async (req, res) => {
  try {
    const { productName, description, price, genre, image } = req.body;

    if (!productName && !description && !price && !genre && !image) {
      return res.json({
        error: "No puedes dejar espacios en blanco",
      });
    } else {
      if (!productName) {
        return res.json({
          error: "El nombre del producto es requerido",
        });
      }
      if (!description) {
        return res.json({
          error: "La descripción del producto es requerida",
        });
      }
      if (!price) {
        return res.json({
          error: "El precio del producto es requerido",
        });
      } else if (price < 0) {
        return res.json({
          error: "El precio del producto no puede ser negativo",
        });
      }
      if (!genre) {
        return res.json({
          error: "El género del producto es requerido",
        });
      }
      if (!image) {
        return res.json({
          error: "La imagen del producto es requerida",
        });
      }

      const exist = await Product.findOne({ productName });
      if (exist) {
        return res.json({
          error: "Ya existe un producto con este nombre",
        });
      }

      const product = await Product.create({
        productName,
        description,
        price,
        genre,
        image,
      });

      if (product) {
        return res.json({
          message: "Se ha creado el producto correctamente",
        });
      } else {
        return res.json({
          error: "Error al intentar añadir el producto",
        });
      }
    }
  } catch (error) {}
};

module.exports = {
  uploadProduct,
};
