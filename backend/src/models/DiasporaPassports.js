const mongoose = require("mongoose");

const diasporaPassportsSchema = new mongoose.Schema({
  passportNo: { type: String, required: true },
  issueDate: { type: Date, required: true },
  issuePlace: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  issueAuthority: { type: String, required: true },
  diasporaID: { type: mongoose.Schema.Types.ObjectId, ref: "DiasporaInfo", required: true },
});

module.exports = mongoose.model("DiasporaPassports", diasporaPassportsSchema);
