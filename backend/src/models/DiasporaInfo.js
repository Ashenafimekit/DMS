const mongoose = require("mongoose");

const diasporaInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  religion: { type: String },
  formerNationality: { type: String },
  presentNationality: { type: String },
  marriedStatus: { type: String },
  passportNumbers: { type: [String] },
  photo: { type: String },
  recordedBy: { type: String, required: true },
  recordedDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DiasporaInfo", diasporaInfoSchema);
