const mongoose = require("mongoose");

const ethiopiaResidenceAddressSchema = new mongoose.Schema({
  region: { type: String },
  city: { type: String },
  kebele: { type: String },
  zone: { type: String },
  district: { type: String },
  subcity: { type: String },
  houseNumbers: { type: String },
  phone: { type: String },
  mobile: { type: String },
  email: { type: String },
  diasporaID: { type: mongoose.Schema.Types.ObjectId, ref: "DiasporaInfo", required: true },
});


const Residence = mongoose.model("EthiopiaResidenceAddress", ethiopiaResidenceAddressSchema);
module.exports = Residence
