const mongoose = require("mongoose");

// Defining Pizza Schema -- data contract
const pizzaSchema = new mongoose.Schema({
  size: String,
  crust: { type: String, default: "thin" },
  cheese: String,
  sauce: String,
  toppings: [String],
});

// Defining the Pizza model
const Pizza = mongoose.model("Pizza", pizzaSchema);

module.exports = {
  model: Pizza,
  schema: pizzaSchema,
};
