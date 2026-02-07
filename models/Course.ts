import { Schema, model, models } from "mongoose";

const CourseSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: "Category",
    index: true
  },

  title: { 
    type: String, 
    required: [true, "Title is required"],
    trim: true
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    index: true
  },
  description: { type: String },
  smallDescription: { type: String, maxlength: 255 }, 

  thumbnail: { type: String }, 
  fileKey: { type: String },  

  price: { type: Number, default: 0 },
  duration: { type: Number, default: 0 }, 
  
  level: { 
    type: String, 
    enum: ["Beginner", "Intermediate", "Advanced"], 
    default: "Beginner" 
  },
  
  status: { 
    type: String, 
    enum: ["Draft", "Published", "Archive"], 
    default: "Draft" 
  },

  attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

CourseSchema.virtual("id").get(function() {
  return this._id.toHexString();
});

CourseSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true
});

CourseSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true
});

export const Course = models?.Course || model("Course", CourseSchema);