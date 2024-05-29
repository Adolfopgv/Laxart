const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    const userId = req.params.userid;
    const productId = req.params.product;

    if (!userId || !productId) {
      return res.json({ error: "Error al añadir producto" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({
        userId,
        products: [{ product: productId, quantity: 1 }],
      });
      await newCart.save();
      return res.status(200).json({ message: "Producto añadido al carrito" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({ message: "Producto añadido al carrito" });
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
