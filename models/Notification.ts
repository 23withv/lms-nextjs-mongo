import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["INFO", "SUCCESS", "WARNING", "ERROR"], 
    default: "INFO" 
  },
  isRead: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

NotificationSchema.virtual("id").get(function() {
  return this._id.toHexString();
});

export const Notification = models.Notification || model("Notification", NotificationSchema);