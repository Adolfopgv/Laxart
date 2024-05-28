const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    const userId = req.params.userid;
    const product = req.params.product;

    if (!userId && !product) {
      return res.json({
        error: "Error al añadir producto",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [product],
      });
    } else {
      cart.products.push(product);
    }

    await cart.save();

    res.status(200).json({ message: "Producto añadido al carrito " });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

const removeFromCart = async (req, res) => {
  try {
  } catch (error) {}
};

const getCartProducts = async (req, res) => {
  try {
    const userId = req.params.userid;

    const products = await Cart.findById({ userId });
    if (products) {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al recoger productos" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCartProducts,
};
