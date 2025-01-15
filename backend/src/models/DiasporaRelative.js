const mongoose = require("mongoose");

const diasporaRelativeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  sex: { type: String },
  region: { type: String },
  zone: { type: String },
  district: { type: String },
  city: { type: String },
  subCity: { type: String },
  houseNumbers: { type: String },
  telephone: { type: String },
  email: { type: String },
  nationality: { type: String },
  relationType: { type: String },
  diasporaID: { type: mongoose.Schema.Types.ObjectId, ref: "DiasporaInfo" },
});

module.exports = mongoose.model("DiasporaRelative", diasporaRelativeSchema);
