const mongoose = require("mongoose");
const DiasporaInfo = require("../models/diasporaInfo");
const Relatives = require("../models/DiasporaRelative");
const Skills = require("../models/DiasporaSkills");
const Passport = require("../models/DiasporaPassports");
const Residence = require("../models/EthiopiaResidenceAddress");

const profile = async (req, res) => {
  const { diasporaInfo, relatives, skills, passport, residence } = req.body;
  const parsedDiasporaInfo = JSON.parse(diasporaInfo);
  const parsedRelatives = JSON.parse(relatives);
  const parsedSkills = JSON.parse(skills);
  const parsedPassport = JSON.parse(passport);
  const parsedResidence = JSON.parse(residence);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingDiasporaInfo = await Passport.findOne({
      passportNo: parsedPassport.passportNumber,
    });
    if (existingDiasporaInfo) {
      console.log("passport number already registered");
      return res
        .status(400)
        .json({ message: "Diaspora info already exists for this user" });
    }

    const diaspora = DiasporaInfo(parsedDiasporaInfo);
    await diaspora.save({ session });
    console.log("diaspora info saved");

    const passportData = {
      ...parsedPassport,
      passportNo: parsedPassport.passportNumber,
      diasporaID: diaspora._id,
    };

    const passport = new Passport(passportData);
    await passport.save({ session });
    console.log("diaspora Passport saved");

    const residenceData = {
      ...parsedResidence,
      diasporaID: diaspora._id,
    };

    const residence = new Residence(residenceData);
    await residence.save({ session });
    console.log("diaspora residence added");

    const skillsArray = parsedSkills;
    for (let skillData of skillsArray) {
      const skillDataWithDiasporaID = {
        ...skillData,
        diasporaID: diaspora._id,
      };

      const skill = new Skills(skillDataWithDiasporaID);
      await skill.save({ session });
      console.log("diaspora skill added");
    }

    const relativeArray = parsedRelatives;
    for (let relativeData of relativeArray) {
      const realtiveDataWtihDiasporaID = {
        ...relativeData,
        diasporaID: diaspora._id,
      };

      const relative = new Relatives(realtiveDataWtihDiasporaID);
      await relative.save({ session });
      console.log("diaspora relatives added");
    }

    await session.commitTransaction();
    res.status(201).json({ message: "profile created successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

const diasporaList = async (req, res) => {
  try {
    const diasporaList = await DiasporaInfo.find();
    res.status(200).json({ diasporaList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const diasporaInfoEditor = async (req, res) => {
  const { id } = req.params;
  const updatedInfo = req.body;

  try {
    const editedInfo = await DiasporaInfo.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });
    if (!editedInfo) {
      return res.status(404).json({ message: "Diaspora record not found" });
    }

    res
      .status(200)
      .json({ message: "Record updated successfully", editedInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteDiaspora = async (req, res) => {
  const { id } = req.params;
  try {
    const diasporaInfo = await DiasporaInfo.findById(id)
      .populate("relatives")
      .populate("skills")
      .populate("passport")
      .populate("residence");

    if (!diasporaInfo) {
      return res.status(404).json({ message: "Diaspora Info not found" });
    }
    // Delete related documents manually
    await Relatives.deleteMany({ diasporaID: id });
    await Skills.deleteMany({ diasporaID: id });
    await Passport.deleteMany({ diasporaID: id });
    await Residence.deleteMany({ diasporaID: id });

    // Now delete the diaspora info
    await diasporaInfo.deleteOne();

    res.status(201).json({ message: "Diaspora info deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const DiasporaPassports = async (req, res) => {
  try {
    const diasporaList = await DiasporaInfo.find();
    const diasporaPassport = await Passport.find();
    res.status(200).json({ diasporaList, diasporaPassport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const EditDiasporaPassport = async (req, res) => {
  const { id } = req.params;
  //console.log("id : ", id);
  const updatedInfo = req.body;
  //console.log("updatedInfo : ", updatedInfo);

  try {
    const updatedPassport = await Passport.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });
    if (!updatedPassport) {
      return res.status(404).json({ message: "Diaspora Passport not found" });
    }
    res
      .status(200)
      .json({ message: "Passport updated successfully", updatedPassport });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const diasporaAddress = async (req, res) => {
  try {
    const address = await Residence.find();
    const diaspora = await DiasporaInfo.find();
    res.status(200).json({ address, diaspora });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const editDiasporaAddress = async (req, res) => {
  const { id } = req.params;
  const updatedInfo = req.body;

  //console.log("id and updatedInfor : ", id, updatedInfo);

  try {
    const updatedAddress = await Residence.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });
    if (!updatedAddress) {
      return res.status(404).json({ message: "Diaspora Address not found" });
    }
    res
      .status(200)
      .json({ message: "Address updated successfully", updatedAddress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const diasporaSkill = async (req, res) => {
  try {
    const skill = await Skills.find();
    const diasporaSkill = await Skills.find();
    const diaspora = await DiasporaInfo.find();
    res.status(200).json({ diasporaSkill, diaspora });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const editDiasporaSkill = async (req, res) => {
  const { id } = req.params;
  const updatedInfo = req.body;

  try {
    const updatedSkill = await Skills.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });
    if (!updatedSkill) {
      return res.status(404).json({ message: "Diaspora Skill not found" });
    }
    res
      .status(200)
      .json({ message: "Skill updated successfully", updatedSkill });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const skill = await Skills.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    await skill.deleteOne();
    res.status(201).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  profile,
  diasporaList,
  diasporaInfoEditor,
  deleteDiaspora,
  DiasporaPassports,
  EditDiasporaPassport,
  diasporaAddress,
  editDiasporaAddress,
  diasporaSkill,
  editDiasporaSkill,
  deleteSkill,
};
