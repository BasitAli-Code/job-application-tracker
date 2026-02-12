const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addApplication,
  getApplications,
  deleteApplication,
  updateApplication,
  getDashboardData,
  getSingleApplication,
} = require("../controllers/jobController");

// 1. Root routes
router.route("/").post(protect, addApplication).get(protect, getApplications);

// 2. Specific routes (MOVE THIS UP)
router.get("/dashboard", protect, getDashboardData);

// 3. Dynamic parameter routes (KEEP THIS AT THE BOTTOM)
router
  .route("/:id")
  .delete(protect, deleteApplication)
  .put(protect, updateApplication)
  .get(protect, getSingleApplication);

module.exports = router;
