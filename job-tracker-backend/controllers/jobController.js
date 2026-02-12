const Job = require("../models/jobApplicationModel");

//function to add job application in Database

const addApplication = async (req, res) => {
  try {
    const { companyName, position, status, jobType, location } = req.body;

    //if any field is empty
    if (!companyName || !position || !status || !jobType || !location) {
      return res.status(400).json({ message: "Fill all the fields" });
    }

    //creating new application
    const application = await Job.create({
      user: req.user._id,
      companyName,
      position,
      status,
      jobType,
      location,
    });

    if (application) {
      res.status(201).json(application);
    } else {
      res.status(400).json({ message: "Invalid application data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//function to get a single application from database

const getSingleApplication = async (req, res) => {
  try {
    const application = await Job.findById(req.params.id);

    // Check if application even exists first
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    //checking if application belongs to user or not
    if (application.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to get this application" });
    }

    res.status(200).json(application);
  } catch (error) {
    //in case request is send with a incorrect id format
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: "Server error while getting application" });
  }
};

//function to get all application (of logged in user) from Database

const getApplications = async (req, res) => {
  try {
    //getting jobs (newest to oldest)
    const applications = await Job.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching applications" });
  }
};

//function to delete a particular application

const deleteApplication = async (req, res) => {
  try {
    const deletedJob = await Job.findById(req.params.id);

    //checking whether job application is present or not in Database
    if (!deletedJob) {
      return res.status(404).json({ message: "Application not found" });
    }

    //Security check
    //making authorized user deletes the application
    if (deletedJob.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this application" });
    }

    await deletedJob.deleteOne();

    res.status(200).json({
      message: `Application for ${deletedJob.companyName} deleted successfully`,
    });
  } catch (error) {
    //in case request is send with a incorrect id format
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res
      .status(500)
      .json({ message: "Server error while deleting application" });
  }
};

//function to update a particular application

const updateApplication = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    //checking whether job application is present or not in Database
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }

    //Security check
    //making authorized user updates the application
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //updating and getting the updated application Data
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res
      .status(500)
      .json({ message: "Server error while deleting application" });
  }
};

//function to get dashboard data
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const [pending, accepted, rejected, interviewing, recent] =
      await Promise.all([
        Job.countDocuments({ user: userId, status: "pending" }),
        Job.countDocuments({ user: userId, status: "accepted" }),
        Job.countDocuments({ user: userId, status: "rejected" }),
        Job.countDocuments({ user: userId, status: "interviewing" }),
        Job.find({ user: userId }).sort({ createdAt: -1 }).limit(4),
      ]);

    const dashboardData = {
      pendingCount: pending,
      acceptedCount: accepted,
      rejectedCount: rejected,
      interviewingCount: interviewing,
      recentJobs: recent,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addApplication,
  getApplications,
  deleteApplication,
  updateApplication,
  getDashboardData,
  getSingleApplication,
};
