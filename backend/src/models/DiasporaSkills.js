const mongoose = require("mongoose");

const diasporaSkillsSchema = new mongoose.Schema({
  diasporaID: { type: mongoose.Schema.Types.ObjectId, ref: "DiasporaInfo", required: true },
  skillExpertID: { type: String, required: true },
  professionalExperience: { type: String },
  expertiseCountry: { type: String },
  professionalAffiliation: { type: String },
  expertiseField: { type: String },
  shortBio: { type: String },
  educationalBackground: { type: String },
});

module.exports = mongoose.model("DiasporaSkills", diasporaSkillsSchema);
