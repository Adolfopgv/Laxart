const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    const userId = req.params.userid;
    const productId = req.params.product;
    const { type } = req.body;

    if (!userId || !productId || !type) {
      return res.status(400).json({ error: "Error al añadir producto" });
    }

    let cart = await Cart.findOne({ userId });
    console.log("Carrito add back: ", cart);

    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [{ product: productId, quantity: 1, type: type }],
      });
      return res.status(200).json({ message: "Producto añadido al carrito" });
    }

    let productInCart = cart.products.find(
      (item) => item.product.toString() === productId && item.type === type
    );

    console.log("producto en carrito", productInCart);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1, type: type });
    }

    await cart.save();

    res.status(200).json({ message: "Producto añadido al carrito" });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
    console.error("Error 500 carrito: ", error);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.params.userid;
    const productId = req.params.product;
    const { type } = req.query;

    if (!userId || !productId || !type) {
      return res.status(400).json({ error: "Error al añadir producto" });
    }

    let cart = await Cart.findOne({ userId });
    console.log("carrito:", cart);
    console.log(productId);
    console.log(type);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    let productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId && item.type === type
    );
    console.log(productIndex);

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    let productInCart = cart.products[productIndex];

    console.log("product in cart: ", productInCart);
    console.log("products: ", cart.products);

    if (productInCart.quantity > 1) {
      productInCart.quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();

    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
    console.log("Error:", error);
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
    let cart = await Cart.findOne({ userId });

    cart.products = [];
    await cart.save();

    return res.status(200).json({ message: "Carrito eliminado" });
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
