const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      email: {
        type: String,
        trim: true,
      },
      username: {
        type: String,
        trim: true,
      },
    },
    shippingDetails: {
      name: {
        type: String,
        trim: true,
      },
      surname: {
        type: String,
        trim: true,
      },
      address1: {
        type: String,
        trim: true,
      },
      address2: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      province: {
        type: String,
        trim: true,
      },
      locality: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: Number,
      },
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
        productName: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
        },
        type: {
          type: String,
        },
        price: {
          type: Number,
        },
        discount: {
          type: Number,
        },
        image: {
          type: String,
        },
        _id: false,
      },
    ],
    totalPrice: {
      type: Number,
    },
    itemsQuantity: {
      type: Number,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
