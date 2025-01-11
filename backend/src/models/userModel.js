const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "member"],
      default: "member",
    },
    isApproved: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to hash passwords before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to create the default superadmin account
userSchema.statics.createDefaultSuperAdmin = async function () {
  try {
    const superAdminExists = await this.findOne({ role: "superadmin" });
    if (!superAdminExists) {
      const superAdmin = new this({
        name: "Super Admin",
        email: "superadmin@gamil.com",
        password: "Super@123", 
        role: "superadmin",
        isApproved: true, // Superadmin is approved by default
      });
      await superAdmin.save();
      console.log("Default superadmin account created: superadmin@example.com / SuperAdmin@123");
    } else {
      console.log("Superadmin account already exists.");
    }
  } catch (error) {
    console.error("Error creating superadmin account:", error.message);
  }
};

// Method to validate passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
