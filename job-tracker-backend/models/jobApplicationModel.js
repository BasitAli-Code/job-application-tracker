const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "interviewing", "accepted", "rejected"],
      default: "pending",
    },
    jobType: {
      type: String,
      required: true,
      enum: ["on site", "remote", "hybrid"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
module.exports = JobApplication;
