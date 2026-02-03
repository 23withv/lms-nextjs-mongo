import mongoose, { Schema, model, models } from "mongoose";

const InstructorRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  experience: { 
    type: String, 
    required: true,
    enum: ["No Experience", "Private Tutoring", "Professional Instructor", "Online Course Creator"] 
  },
  skills: { type: [String], required: true }, 
  videoPortfolios: { type: [String], required: true }, 
  motivation: { type: String, required: true },
  linkedinUrl: { type: String }, 
  status: { 
    type: String, 
    enum: ["PENDING", "APPROVED", "REJECTED"], 
    default: "PENDING" 
  },
  adminFeedback: { type: String },
}, { timestamps: true });

export const InstructorRequest = models.InstructorRequest || model("InstructorRequest", InstructorRequestSchema);