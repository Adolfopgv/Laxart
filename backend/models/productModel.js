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
    imageAlt: {
        type: String
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
                type1: {
                    type: String,
                    default: "Collar"
                },
                type2: {
                    type: String,
                    default: "Pendiente suelto"
                },
                type3: {
                    type: String,
                    default: "Par de pendientes"
                },
                type4: {
                    type: String,
                    default: "Llavero"
                },
                type5: {
                    type: String,
                    default: "Chocker"
                },
                type6: {
                    type: String,
                    default: "Imán"
                },
                type7: {
                    type: String,
                    default: "Pinza para el pelo"
                },
                type8: {
                    type: String,
                    default: "Broche"
                }
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
    reviews: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        review: [{
            type: String,
            trim: true,
        }]
    }
  },
  { toJSON: { getters: true }, timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;

