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

router.route("/").post(protect, addApplication).get(protect, getApplications);

router.get("/dashboard", protect, getDashboardData);

router
  .route("/:id")
  .delete(protect, deleteApplication)
  .put(protect, updateApplication)
  .get(protect, getSingleApplication);

module.exports = router;
