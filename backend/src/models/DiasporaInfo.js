const mongoose = require("mongoose");

const Relatives = require("../models/DiasporaRelative");
const Skills = require("../models/DiasporaSkills");
const Passport = require("../models/DiasporaPassports");
const Residence = require("../models/EthiopiaResidenceAddress");

const diasporaInfoSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    religion: { type: String },
    formerNationality: { type: String },
    presentNationality: { type: String },
    marriedStatus: { type: String },
    // passportNumbers: { type: [String] },
    photo: { type: String },
    relatives: [
      { type: mongoose.Schema.Types.ObjectId, ref: "DiasporaRelative" },
    ],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "DiasporaSkills" }],
    passport: { type: mongoose.Schema.Types.ObjectId, ref: "DiasporaPassports" },
    residence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EthiopiaResidenceAddress",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("DiasporaInfo", diasporaInfoSchema);
