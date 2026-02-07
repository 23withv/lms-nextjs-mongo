import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, select: true }, 
  image: { type: String },
  role: { 
    type: String, 
    enum: ["STUDENT", "INSTRUCTOR", "ADMIN"], 
    default: "STUDENT" 
  },
  provider: { type: String, default: "credentials" }, 
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals:true }
});

UserSchema.virtual("id").get(function() {
  return this._id.toHexString();
});

export const User = mongoose.models?.User || mongoose.model("User", UserSchema);