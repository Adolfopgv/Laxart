const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    repeatPassword: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        "data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNMjU2IDI1NmM1Mi44MDUgMCA5Ni00My4yMDEgOTYtOTZzLTQzLjE5NS05Ni05Ni05Ni05NiA0My4yMDEtOTYgOTYgNDMuMTk1IDk2IDk2IDk2em0wIDQ4Yy02My41OTggMC0xOTIgMzIuNDAyLTE5MiA5NnY0OGgzODR2LTQ4YzAtNjMuNTk4LTEyOC40MDItOTYtMTkyLTk2eiIvPjwvc3ZnPg==",
    },
    role: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
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
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
