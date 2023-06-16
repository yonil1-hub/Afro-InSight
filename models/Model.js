const mongoose = require("mongoose");

/**
 * User Schema
 * @private
 * Mongoose schema for user- contains username,
 *                           email, password, and createdAt
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, enum: ["user", "admin"], default: "user" },
});
const User = mongoose.model("User", userSchema);

/**
 * Site Schema
 * @private
 * Mongoose schema for site- contains siteId,
 *                          name, description,
 *                          location, country,
 *                          coordinates, images,
 *                          rating, createdAt,
 *                          and updatedAt
 */
const siteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  coordinates: { type: [{ type: Number }], required: true },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Sites = mongoose.model("Sites", siteSchema);

/**
 * Review Schema
 * @private
 * Mongoose schema for review- contains siteId,
 *                           userId, rating,
 *                           comment, createdAt,
 *                           and updatedAt
 */
const reviewSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = { User, Sites, Review };
