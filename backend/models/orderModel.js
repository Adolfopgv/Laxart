const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Sin confirmar",
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
  totalPrice: {
    type: Number,
  },
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
