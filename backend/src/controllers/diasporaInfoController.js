const mongoose = require('mongoose');
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
    await diaspora.save({session});
    console.log("diaspora info saved");

    const passportData = {
      ...parsedPassport,
      passportNo: parsedPassport.passportNumber,
      diasporaID: diaspora._id,
    };

    const passport = new Passport(passportData);
    await passport.save({session});
    console.log("diaspora Passport saved");

    const residenceData = {
      ...parsedResidence,
      diasporaID: diaspora._id,
    };

    const residence = new Residence(residenceData);
    await residence.save({session});
    console.log("diaspora residence added");

    const skillsArray = parsedSkills;
    for (let skillData of skillsArray) {
      const skillDataWithDiasporaID = {
        ...skillData,
        diasporaID: diaspora._id,
      };

      const skill = new Skills(skillDataWithDiasporaID);
      await skill.save({session});
      console.log("diaspora skill added");
    }

    const relativeArray = parsedRelatives;
    for (let relativeData of relativeArray) {
      const realtiveDataWtihDiasporaID = {
        ...relativeData,
        diasporaID: diaspora._id,
      };

      const relative = new Relatives(realtiveDataWtihDiasporaID);
      await relative.save({session});
      console.log("diaspora relatives added");
    }

    await session.commitTransaction();
    res.status(201).json({ message: "profile created successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally{
    session.endSession();
  }
};

module.exports = { profile };
