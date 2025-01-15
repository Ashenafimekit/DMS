const mongoose = require("mongoose");

const diasporaSkillsSchema = new mongoose.Schema({
  expertise: { type: String, required: true },
  professionalExperience: { type: String },
  expertiseCountry: { type: String },
  professionalAffiliation: { type: String },
  expertiseField: { type: String },
  shortBio: { type: String },
  educationalBackground: { type: String },
  diasporaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiasporaInfo",
    required: true,
  },
});

module.exports = mongoose.model("DiasporaSkills", diasporaSkillsSchema);
