const Company = require("../models/CompanyModel");

const createCompany = async (req, res) => {
  const formData = req.body;

  try {
    const checkCompany = await Company.findOne({
      organizationName: formData.organizationName,
    });
    if (checkCompany) {
      return res.status(400).json({ message: "Organization already exists" });
    }

    const newCompany = new Company({
      organizationName: formData.organizationName,
      country: formData.country,
      city: formData.city,
      organizationType: formData.organizationType,
      dateOfEstablishment: formData.dateOfEstablishment,
      address: formData.address,
      email: formData.email,
      phone: formData.phone,
      numberOfMembers: formData.numberOfMembers,
      briefDescription: formData.briefDescription,
      status: formData.status,
      director: {
        name: formData.directorName,
        fatherName: formData.fatherName,
        grandfatherName: formData.grandfatherName,
        contact: formData.contact,
        email: formData.directorEmail,
        phone: formData.directorPhone,
      },
    });

    await newCompany.save();
    console.log("Company data saved successfully.");
    res.status(201).json({ message: "Company data saved successfully." });
  } catch (error) {
    console.error("Error saving company data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCompany = async (req, res) => {
  try {
    const company = await Company.find();
    res.status(200).json({ company });
  } catch (error) {
    console.error("Error fetching company data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editCompany = async (req, res) => {
  const formData = req.body;
  const { id } = req.params;
  try {
    const company = await Company.findByIdAndUpdate(id, formData, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res
      .status(200)
      .json({ message: "Organization data Edited Successfully", company });
  } catch (error) {
    console.error("Error updating company data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(201).json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Error deleting Organization data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editDirector = async (req, res) => {
  const { id } = req.params;
  const updatedInfo = req.body.director;
 // console.log("updatedInfo", updatedInfo);
  try {
    const director = await Company.findByIdAndUpdate(
      id,
      {
        director: updatedInfo,
      },
      { new: true }
    );

    if (!director) {
      console.log("Director not found");
      return res.status(404).json({ message: "Director not found" });
    }
    res.status(200).json({ message: "Updated Successfully", director });
  } catch (error) {
    console.error("Error updating director data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCompany,
  getCompany,
  editCompany,
  deleteCompany,
  editDirector,
};
