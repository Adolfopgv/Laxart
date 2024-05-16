const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 3600 }, // 1 Hora
});

module.exports = mongoose.model("EmailToken", emailTokenSchema);
