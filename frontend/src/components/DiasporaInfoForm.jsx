import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { message } from "antd";

const DiasporaInfoForm = () => {
  const [formData, setFormData] = useState({
    // Diaspora Info
    diasporaInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      religion: "",
      formerNationality: "",
      presentNationality: "",
      marriedStatus: "",
      passportNumbers: "",
      photo: null,
    },

    // Diaspora Passports
    passports: {
      passportNumber: "",
      issueDate: "",
      issuePlace: "",
      expiryDate: "",
      issueAuthority: "",
    },

    // Diaspora Relative
    relatives: [
      {
        firstName: "",
        middleName: "",
        lastName: "",
        sex: "",
        region: "",
        zone: "",
        district: "",
        city: "",
        subcity: "",
        houseNumbers: "",
        telePhone: "",
        email: "",
        nationality: "",
        relationType: "",
      },
    ],

    // Diaspora Skills
    skills: [
      {
        expertise: "",
        professionalExperience: "",
        expertiseCountry: "",
        professionalAffiliation: "",
        expertiseField: "",
        shortBio: "",
        educationalBackground: "",
      },
    ],

    // Ethiopia Residence Address
    residence: {
      region: "",
      city: "",
      kebele: "",
      zone: "",
      district: "",
      subcity: "",
      houseNumbers: "",
      phone: "",
      mobile: "",
      email: "",
    },
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is part of the diasporaInfo object
    if (name in formData.diasporaInfo) {
      setFormData((prev) => ({
        ...prev,
        diasporaInfo: {
          ...prev.diasporaInfo, // Keep existing values of diasporaInfo
          [name]: value, // Update the field that matches the name of the input
        },
      }));
    } else if (name in formData.passports) {
      setFormData((prev) => ({
        ...prev,
        passports: {
          ...prev.passports, // Keep existing values of diasporaInfo
          [name]: value, // Update the field that matches the name of the input
        },
      }));
    } else {
      // Handle non-diasporaInfo fields (like photo, relatives, etc.)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle file change (photo or documents)
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // Handle dynamic addition of relatives, skills, and passports
  const handleDynamicAdd = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        field === "relatives"
          ? {
              firstName: "",
              middleName: "",
              lastName: "",
              sex: "",
              region: "",
              zone: "",
              district: "",
              city: "",
              subcity: "",
              houseNumbers: "",
              telePhone: "",
              email: "",
              nationality: "",
              relationType: "",
            }
          : {
              expertise: "",
              professionalExperience: "",
              expertiseCountry: "",
              professionalAffiliation: "",
              expertiseField: "",
              shortBio: "",
              educationalBackground: "",
            },
      ],
    }));
  };

  // Handle dynamic field change for relatives, skills, and passports
  const handleDynamicChange = (field, index, name, value) => {
    const updatedData = [...formData[field]];
    updatedData[index][name] = value;
    setFormData({ ...formData, [field]: updatedData });
  };

  const validateFormData = (formData) => {
    const errors = [];

    // Diaspora Info Validation
    const { diasporaInfo, passports, relatives, skills, residence } = formData;
    if (!diasporaInfo.firstName.trim()) {
      errors.push("First name is required.");
    }
    if (!diasporaInfo.lastName.trim()) {
      errors.push("Last name is required.");
    }
    if (!diasporaInfo.birthDate) {
      errors.push("Birth date is required.");
    }
    if (!diasporaInfo.presentNationality.trim()) {
      errors.push("Present nationality is required.");
    }

    // Passport Validation
    if (!passports.passportNumber.trim()) {
      errors.push("Passport number is required.");
    }
    if (!passports.issuePlace) {
      errors.push("Passport issue place is required.");
    }
    if (!passports.issueAuthority) {
      errors.push("Passport issue Authority is required.");
    }
    if (!passports.issueDate) {
      errors.push("Passport issue date is required.");
    }
    if (!passports.expiryDate) {
      errors.push("Passport expiry date is required.");
    }

    // Relative Validation
    relatives.forEach((relative, index) => {
      if (!relative.firstName.trim() || !relative.lastName.trim()) {
        errors.push(
          `Relative ${index + 1}: First and last names are required.`
        );
      }
      if (!relative.relationType.trim()) {
        errors.push(`Relative ${index + 1}: Relation type is required.`);
      }
    });

    // Skills Validation
    skills.forEach((skill, index) => {
      if (!skill.expertise.trim()) {
        errors.push(`Skill ${index + 1}: Expertise is required.`);
      }
    });

    // Residence Validation
    if (!residence.region.trim()) {
      errors.push("Residence region is required.");
    }
    if (!residence.city.trim()) {
      errors.push("Residence city is required.");
    }
    if (!residence.phone.trim()) {
      errors.push("Residence phone number is required.");
    }

    // Return errors
    return errors;
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateFormData(formData);
    if (errors.length > 0) {
      errors.forEach((error) => message.error(error));
      return;
    }

    const formDataToSubmit = new FormData();

    // Append basic form data fields
    formDataToSubmit.append(
      "diasporaInfo",
      JSON.stringify(formData.diasporaInfo)
    );
    formDataToSubmit.append("relatives", JSON.stringify(formData.relatives));
    formDataToSubmit.append("skills", JSON.stringify(formData.skills));
    formDataToSubmit.append("passport", JSON.stringify(formData.passports));
    formDataToSubmit.append("residence", JSON.stringify(formData.residence));

    // Append photo if available
    if (formData.diasporaInfo.photo) {
      formDataToSubmit.append("photo", formData.diasporaInfo.photo);
    }

    //console.log("data : ", formData);
    //console.log("form data to sumbit : ", formDataToSubmit);

    try {
      const response = await axios.post(
        `${apiUrl}/diaspora/diaspora-info`,
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        console.log(response.data.message);
        message.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 400) {
          message.error(error.response.data.message);
        }
        if (error.response.status === 403) {
          message.error(error.response.data.message);
        }
        if (error.response.status === 500) {
          message.error(error.response.data.message);
        }
      } else {
        message.error("Error creating profile.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <ToastContainer />
      <form
        className="p-8 space-y-6 bg-white shadow-2xl rounded-lg max-w-4xl w-full"
        onSubmit={handleSubmit}
      >
        {/* Diaspora Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Diaspora Information</h2>
          <div className="relative">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.diasporaInfo.firstName}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="absolute right-2 font-bold text-2xl text-red-500">
              *
            </span>
          </div>

          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            onChange={handleChange}
            value={formData.diasporaInfo.middleName}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.diasporaInfo.lastName}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="absolute right-2 font-bold text-2xl text-red-500">
              *
            </span>
          </div>

          <div className="relative">
            <input
              type="date"
              name="birthDate"
              onChange={handleChange}
              value={formData.diasporaInfo.birthDate}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute top-3 right-96">birthdate</span>
            <span className="absolute right-2 font-bold text-2xl text-red-500">
              *
            </span>
          </div>

          <input
            type="text"
            name="religion"
            placeholder="Religion"
            onChange={handleChange}
            value={formData.diasporaInfo.religion}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="formerNationality"
            placeholder="Former Nationality"
            onChange={handleChange}
            value={formData.diasporaInfo.formerNationality}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type="text"
              name="presentNationality"
              placeholder="Present Nationality"
              onChange={handleChange}
              value={formData.diasporaInfo.presentNationality}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-2 font-bold text-2xl text-red-500">
              *
            </span>
          </div>

          <select
            name="marriedStatus"
            onChange={handleChange}
            value={formData.diasporaInfo.marriedStatus}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Married Status
            </option>
            <option value="married">Single</option>
            <option value="non-married">Non-Married</option>
          </select>

          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            value={formData.diasporaInfo.photo}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
        </div>

        {/* Passports */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Diaspora Passport</h2>
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Passport Number"
                value={formData.passports.passportNumber || ""}
                onChange={(e) => {
                  const updatedPassport = { ...formData.passports };
                  updatedPassport.passportNumber = e.target.value;
                  setFormData({ ...formData, passports: updatedPassport });
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-2 font-bold text-2xl text-red-500">
                *
              </span>
            </div>

            <div className="relative">
              <input
                type="date"
                placeholder="Issue Date"
                value={formData.passports.issueDate || ""}
                onChange={(e) => {
                  const updatedPassport = { ...formData.passports };
                  updatedPassport.issueDate = e.target.value;
                  setFormData({ ...formData, passports: updatedPassport });
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute top-3 right-96">issue date</span>
              <span className="absolute right-2 font-bold text-2xl text-red-500">
                *
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Issue Place"
                value={formData.passports.issuePlace || ""}
                onChange={(e) => {
                  const updatedPassport = { ...formData.passports };
                  updatedPassport.issuePlace = e.target.value;
                  setFormData({ ...formData, passports: updatedPassport });
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-2 font-bold text-2xl text-red-500">
                *
              </span>
            </div>

            <div className="relative">
              <input
                type="date"
                placeholder="Expiry Date"
                value={formData.passports.expiryDate || ""}
                onChange={(e) => {
                  const updatedPassport = { ...formData.passports };
                  updatedPassport.expiryDate = e.target.value;
                  setFormData({ ...formData, passports: updatedPassport });
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute top-3 right-96">expiry date</span>
              <span className="absolute right-2 font-bold text-2xl text-red-500">
                *
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Issue Authority"
                value={formData.passports.issueAuthority || ""}
                onChange={(e) => {
                  const updatedPassport = { ...formData.passports };
                  updatedPassport.issueAuthority = e.target.value;
                  setFormData({ ...formData, passports: updatedPassport });
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-2 font-bold text-2xl text-red-500">
                *
              </span>
            </div>
          </div>
        </div>

        {/* Add Skills */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Diaspora Skills</h2>
          {formData.skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Expertise"
                  value={skill.expertise || ""}
                  onChange={(e) =>
                    handleDynamicChange(
                      "skills",
                      index,
                      "expertise",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-2 font-bold text-2xl text-red-500">
                  *
                </span>
              </div>

              <input
                type="text"
                placeholder="Professional Experience"
                value={skill.professionalExperience || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "skills",
                    index,
                    "professionalExperience",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Expertise Country"
                value={skill.expertiseCountry || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "skills",
                    index,
                    "expertiseCountry",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Professional Affiliation"
                value={skill.professionalAffiliation || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "skills",
                    index,
                    "professionalAffiliation",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Experty Field"
                value={skill.expertiseField || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "skills",
                    index,
                    "expertiseField",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Short Bio"
                value={skill.shortBio || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "skills",
                    index,
                    "shortBio",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>

              <input
                type="text"
                placeholder="Educational Background"
                value={skill.educationalBackground || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "skills",
                    index,
                    "educationalBackground",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            type="button"
            className="px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-200"
            onClick={() => handleDynamicAdd("skills")}
          >
            Add Skill
          </button>
        </div>

        {/* Residence Address */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Ethiopia Residence Address</h2>
          <div className="relative space-y-4">
            {Object.keys(formData.residence).map((key) => (
              <div key={key} className="relative">
                <input
                  type="text"
                  name={key}
                  placeholder={key}
                  value={formData.residence[key] || ""}
                  onChange={(e) => {
                    const updatedResidence = { ...formData.residence };
                    updatedResidence[key] = e.target.value;
                    setFormData({ ...formData, residence: updatedResidence });
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Conditionally render the asterisk */}
                {["region", "city", "phone"].includes(key) && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold text-2xl text-red-500">
                    *
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Relatives */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Diaspora Relatives</h2>
          {formData.relatives.map((relative, index) => (
            <div key={index} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="First Name"
                  value={relative.firstName || ""}
                  onChange={(e) =>
                    handleDynamicChange(
                      "relatives",
                      index,
                      "firstName",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-2 font-bold text-2xl text-red-500">
                  *
                </span>
              </div>

              <input
                type="text"
                placeholder="Middle Name"
                value={relative.middleName || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "relatives",
                    index,
                    "middleName",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={relative.lastName || ""}
                  onChange={(e) =>
                    handleDynamicChange(
                      "relatives",
                      index,
                      "lastName",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-2 font-bold text-2xl text-red-500">
                  *
                </span>
              </div>

              <select
                value={relative.sex || ""}
                onChange={(e) =>
                  handleDynamicChange("relatives", index, "sex", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Sex
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <input
                type="text"
                placeholder="Region"
                value={relative.region || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "relatives",
                    index,
                    "region",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Zone"
                value={relative.zone || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "relatives",
                    index,
                    "zone",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="District"
                value={relative.district || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "relatives",
                    index,
                    "district",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="City"
                value={relative.city || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "relatives",
                    index,
                    "city",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Sub City"
                value={relative.subcity || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "relatives",
                    index,
                    "subcity",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="House Number"
                value={relative.houseNumbers || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "relatives",
                    index,
                    "houseNumbers",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Nationality"
                value={relative.nationality || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    "relatives",
                    index,
                    "nationality",
                    e.target.value
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Relation Type"
                  value={relative.relationType || ""}
                  onChange={(e) =>
                    handleDynamicChange(
                      "relatives",
                      index,
                      "relationType",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-2 font-bold text-2xl text-red-500">
                  *
                </span>
              </div>

              {/* Add other relative fields similarly */}
            </div>
          ))}
          <button
            type="button"
            className="px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-200"
            onClick={() => handleDynamicAdd("relatives")}
          >
            Add Relative
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DiasporaInfoForm;
