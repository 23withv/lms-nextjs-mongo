import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { 
    type: String, 
    required: [true, "Category name is required"],
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    index: true
  },
  smallDescription: { 
    type: String,
    maxlength: 200 
  },
}, { 
  timestamps: true, 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

CategorySchema.virtual("id").get(function() {
  return this._id.toHexString();
});

CategorySchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "categoryId"
});

export const Category = models?.Category || model("Category", CategorySchema);