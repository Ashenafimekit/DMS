const mongoose = require("mongoose");

const diasporaRelativeSchema = new mongoose.Schema({
  addressID: { type: String },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  sex: { type: String },
  region: { type: String },
  zone: { type: String },
  district: { type: String },
  city: { type: String },
  subCity: { type: String },
  houseNumber: { type: String },
  telephone: { type: String },
  email: { type: String },
  nationality: { type: String },
  diasporaID: { type: mongoose.Schema.Types.ObjectId, ref: "DiasporaInfo" },
  relationType: { type: String },
});

module.exports = mongoose.model("DiasporaRelative", diasporaRelativeSchema);
