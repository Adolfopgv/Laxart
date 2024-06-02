const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    const userId = req.params.userid;
    const productId = req.params.product;

    if (!userId || !productId) {
      return res.json({ error: "Error al añadir producto" });
    }

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      await Cart.create({
        userId,
        products: [{ product: productId, quantity: 1 }],
      });
      return res.status(200).json({ message: "Producto añadido al carrito" });
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (productInCart) {
      productInCart.quantity += 1;
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
    const userId = req.params.userid;
    const productId = req.params.product;

    const cart = await Cart.findOne({ userId });

    const productInCart = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (productInCart && productInCart.quantity > 1) {
      productInCart.quantity -= 1;
    } else if (productInCart.quantity <= 1) {
      productInCart.deleteOne();
    } else {
      return res.json({ error: "No se ha podido eliminar el producto" });
    }

    await cart.save();

    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

const getCartProducts = async (req, res) => {
  try {
    const userId = req.params.userid;

    const products = await Cart.findOne({ userId: userId });
    if (products) {
      return res.json(products.products);
    } else {
      return res.json({ error: "No hay un carrito para este usuario" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al recoger productos" });
  }
};

const removeAllProducts = async (req, res) => {
  try {
    const userId = req.params.userid;
    const cart = await Cart.findOne({ userId: userId });

    if (cart) {
      cart.products = [];
      await cart.save();
      res.status(200).json({ message: "Carrito eliminado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al borrar el carrito" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCartProducts,
  removeAllProducts,
};
