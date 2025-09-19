import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema  = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['employee', 'support', 'admin'], default: 'employee' },
  settings: {
    theme: { type: String, enum: ["light", "dark"], default: "light" }
  },
  is_active: {
      type: Boolean,
      default: true, // ✅ new field (true = active, false = inactive)
    },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre('save', async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;

