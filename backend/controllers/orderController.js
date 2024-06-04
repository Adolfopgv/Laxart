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
    const { products, totalPrice, itemsQuantity } = req.body;

    if (!userId || !products || !products.length || !totalPrice) {
      return res.status(400).json({
        error: "Faltan datos necesarios para realizar el pedido",
      });
    }

    const newOrder = new Order({
      userId,
      items: products.map((product) => ({
        product: product.productId,
        quantity: product.quantity,
        type: product.type,
      })),
      totalPrice: totalPrice,
      itemsQuantity: itemsQuantity,
    });
    await newOrder.save();

    res.status(200).json({ message: "Pedido realizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al realizar el pedido" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    if (orders) {
      return res.json(orders);
    }
  } catch (error) {
    console.log(error);
  }
};

const changeOrderState = async (req, res) => {
  try {
    const orderId = req.params.orderid;
    const { orderState } = req.body;

    const order = await Order.findById(orderId);

    if (order) {
      order.status = orderState;
      await order.save();
      return res.status(200).json({ message: "Estado cambiado" });
    } else {
      return res.json({ error: "No se ha encontrado ningún pedido" });
    }
  } catch (error) {
    console.error("Change order state: ", error);
  }
};

module.exports = { checkoutOrder, registerOrder, getOrders, changeOrderState };
