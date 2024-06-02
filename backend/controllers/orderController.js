const Stripe = require("stripe");
const Order = require("../models/orderModel");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkoutOrder = async (req, res) => {
  const { id, amount } = req.body;

  try {
    console.log(req.body);
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "EUR",
      description: "Cart products",
      payment_method: id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    console.log(payment);

    res.status(200).json({ message: "Pago realizado con éxito" });
  } catch (error) {
    return res.json({ error: error.raw.message });
  }
};

const registerOrder = async (req, res) => {
  try {
    const userId = req.params.userid;
    const products = req.body.products;

    if (!userId || !products || !products.length) {
      return res.status(400).json({
        error: "Faltan datos necesarios para realizar el pedido",
      });
    }

    const newOrder = new Order({
      userId,
      items: products.map((product) => ({
        product: product.productId,
        quantity: product.quantity,
      })),
    });
    await newOrder.save();

    res.status(200).json({ message: "Pedido realizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al realizar el pedido" });
  }
};

module.exports = { checkoutOrder, registerOrder };
