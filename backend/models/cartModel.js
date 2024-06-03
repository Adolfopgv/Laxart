const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      require: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          unique: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        type: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
