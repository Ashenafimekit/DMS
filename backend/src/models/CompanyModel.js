const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  organizationType: {
    type: String,
    enum: ["Private", "Public", "NGO"],
    required: true,
  },
  dateOfEstablishment: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  numberOfMembers: {
    type: Number,
    required: true,
    min: 1,
  },
  briefDescription: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
  director: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    grandfatherName: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
