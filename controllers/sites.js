const Sites = require("../models/Model").Sites;
const Reviews = require("../models/Model").Reviews;

exports.createSite = async (req, res) => {
  const { name, description, location, country, coordinates, images } =
    req.body;
  const userId = req.user.id;
  if (
    !name ||
    !description ||
    !location ||
    !country ||
    !coordinates ||
    !images
  ) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }

  const newSite = await Sites.create({
    name,
    description,
    location,
    country,
    coordinates,
    images,
    userId,
  });
  res.status(201).json({ message: "Site created", data: newSite });
};

exports.updateSite = async (req, res) => {
  const { siteId } = req.params;
  const updateData = req.body;
  const author = req.user.id;

  const site = await Sites.findById(siteId);
  if (!site) {
    return res.status(404).json({ message: "Site not found" });
  }

  if (String(site.userId) !== String(author)) {
    return res
      .status(403)
      .json({ message: "You are not authorized to edit this site" });
  }

  const updatedSite = await Sites.findByIdAndUpdate(
    siteId,
    { ...updateData, updatedAt: Date.now() },
    { new: true }
  );

  res.status(200).json({ message: "Site updated", data: updatedSite });
};

exports.deleteSite = async (req, res) => {
  const { siteId } = req.params;
  const { type } = req.user;

  const site = await Sites.findById(siteId);

  if (!site) {
    return res
      .status(404)
      .json({ message: `Site with id ${siteId} is not found` });
  }

  if (type !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this site" });
  }

  await Sites.findByIdAndDelete(siteId);

  res.status(204).json();
};

exports.getAllSites = async (req, res) => {
  const { location, country, rating } = req.query;

  const filter = {};
  if (location) filter.location = location;
  if (country) filter.country = country;
  if (rating) filter.rating = rating;

  const sites = await Sites.find(filter);

  res.status(200).json({ message: "Sites found", data: sites });
};

exports.getOneSite = async (req, res) => {
  const { siteId } = req.params;

  const site = await Sites.findById(siteId);
  if (!site) {
    return res
      .status(404)
      .json({ message: `Site with id ${siteId} is not found` });
  }

  res.status(200).json({ message: "Site found", data: site });
};

exports.addReview = async (req, res) => {
  const { siteId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  const site = await Sites.findById(siteId);
  if (!site) {
    return res
      .status(404)
      .json({ message: `Site with id ${siteId} is not found` });
  }

  if (String(site.userId) === String(userId)) {
    return res.status(403).json({ message: "You cannot review your own site" });
  }

  const review = await Reviews.create({
    rating,
    comment,
    userId,
    siteId,
  });

  res.status(201).json({ message: "Review added", data: review });
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  const review = await Reviews.findById(reviewId);
  if (!review) {
    return res
      .status(404)
      .json({ message: `Review with id ${reviewId} is not found` });
  }

  if (String(review.userId) !== String(userId)) {
    return res
      .status(403)
      .json({ message: "You are not authorized to edit this review" });
  }

  const updatedReview = await Reviews.findByIdAndUpdate(
    reviewId,
    { rating, comment, updatedAt: Date.now() },
    { new: true }
  );

  res.status(200).json({ message: "Review updated", data: updatedReview });
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const { type } = req.user;

  const review = await Reviews.findById(reviewId);

  if (!review) {
    return res
      .status(404)
      .json({ message: `Review with id ${reviewId} is not found` });
  }

  if (type !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this review" });
  }

  await Reviews.findByIdAndDelete(reviewId);

  res.status(204).json();
};

exports.getAllReviews = async (req, res) => {
  const { siteId } = req.query;

  const reviews = await Reviews.find({ siteId });

  res.status(200).json({ message: "Reviews found", data: reviews });
};

exports.getTopRatedSites = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const sites = await Sites.find()
    .sort({ rating: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  res.status(200).json({ message: "Top rated sites found", data: sites });
};

exports.getTopRatedSitesByCountry = async (req, res) => {
  const { country } = req.query;
  const { page = 1, limit = 10 } = req.query;

  const sites = await Sites.find({ country })
    .sort({ rating: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  res
    .status(200)
    .json({ message: `Top rated sites from ${country}`, data: sites });
};
