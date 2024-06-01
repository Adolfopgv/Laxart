const Stripe = require("stripe");
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
    const productId = req.params.productid;
  } catch (error) {}
};

module.exports = { checkoutOrder, registerOrder };
