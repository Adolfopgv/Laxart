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
            {
                type1: "Collar",
                type2: "Pendiente suelto",
                type3: "Par de pendientes",
                type4: "Llavero",
                type5: "Chocker",
                type6: "Imán",
                type7: "Pinza para el pelo",
                type8: "Broche",
            }
        ]
    },
    discount: {
        type: Number
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        review: {
            type: String,
            trim: true,
        }
    }]
  },
  { toJSON: { getters: true }, timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;

