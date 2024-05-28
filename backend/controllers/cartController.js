const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
  try {
    const userId = req.params.userid;
    const productId = req.params.product;

    if (!userId && !productId) {
      return res.json({
        error: "Error al añadir producto",
      });
    }

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = await Cart.create({
        userId: user._id,
        products: [product._id],
      });
    } else {
      cart.products.push([product._id]);
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

    const products = await Cart.findOne({ userId: userId });
    if (products) {
      res.json(products.products);
    } else {
      res.json({ error: "No hay un carrito para este usuario" });
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
