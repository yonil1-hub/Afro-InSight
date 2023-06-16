const express = require("express");

const {
  createSite,
  updateSite,
  deleteSite,
  getAllSites,
  getOneSite,
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getTopRatedSites,
} = require("../controllers/sites");

const { verifyToken } = require("../middlewares/verifyToken");
const { isAdmin, isUser } = require("../middlewares/roleManager");

const router = express.Router();
router.post("/create", verifyToken, isUser, createSite);
router.put("/update/:siteId", verifyToken, isUser, updateSite);
router.delete("/delete/:siteId", verifyToken, isAdmin, deleteSite);
router.get("/all", getAllSites);
router.get("/top", getTopRatedSites);
router.get("/:siteId", getOneSite);
router.post("/:siteId/review", verifyToken, isUser, addReview);
router.put("/:reviewId", verifyToken, isUser, updateReview);
router.delete("/:reviewId", verifyToken, isUser, deleteReview);
router.get("/:siteId/reviews", getAllReviews);

module.exports = router;
