const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
      set: (v) => v * 100,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    types: {
      type: Array,
      default: [
        "Collar",
        "Pendiente suelto",
        "Par de pendientes",
        "Llavero",
        "Chocker",
        "Imán",
        "Pinza para el pelo",
        "Broche",
      ],
    },
    discount: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
          trim: true,
        },
        review: {
          type: String,
          trim: true,
        },
        _id: false,
      },
    ],
  },
  { toJSON: { getters: true }, timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
