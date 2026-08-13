//controllers to handle the http requests and responses

const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJob,
} = require("../models/jobModel");

//validation helper to check all job fields have been provided

function validateJobData(title, company, location, description, userId) {
  if (!title || !company || !location || !description || !userId) {
    return "Title, company, location, description and userId are required";
  }
  if (Number.isNaN(Number(userId))) {
    return "userId must be a valid number";
  }
  return null;
}

//get all jobs
async function getJobs(req, res) {
  try {
    const { search } = req.query;
    let jobs;
    if (search) {
      jobs = await searchJob(search);
    } else {
      jobs = await getAllJobs();
    }
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error retrieving jobs:", error.message);

    res.status(500).json({
      message: "Failed to retrieve jobs",
    });
  }
}

//get job by id
async function getJob(req, res) {
  try {
    const job = await getJobById(req.params.id);

    if (job.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }
    res.status(200).json(job[0]);
  } catch (error) {
    console.error("Error retrieving job:", error.message);
    res.status(500).json({
      message: "Failed to retireve job",
    });
  }
}

//create job
async function addJob(req, res) {
  try {
    const { title, company, location, description, userId } = req.body;

    const validationError = validateJobData(
      title,
      company,
      location,
      description,
      userId,
    );

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const result = await createJob(
      title,
      company,
      location,
      description,
      userId,
    );
    const newJob = await getJobById(result.insertId);
    res.status(201).json({
      message: "Job created successfully",
      job: newJob[0],
    });
  } catch (error) {
    console.error("Error creating job:", error.message);
    res.status(500).json({
      message: "Failed to create job",
    });
  }
}

//update job
async function editJob(req, res) {
  try {
    const { title, company, location, description, userId } = req.body;

    // Validate the submitted data.
    const validationError = validateJobData(
      title,
      company,
      location,
      description,
      userId,
    );

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const result = await updateJob(
      req.params.id,
      title,
      company,
      location,
      description,
      userId,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Return the updated record.
    const updatedJob = await getJobById(req.params.id);

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob[0],
    });
  } catch (error) {
    console.error("Error updating job:", error.message);

    res.status(500).json({
      message: "Failed to update job",
    });
  }
}

//delete job
async function removeJob(req, res) {
  try {
    const result = await deleteJob(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error.message);

    res.status(500).json({
      message: "Failed to delete job",
    });
  }
}

//export controller functions
module.exports = {
  getJobs,
  getJob,
  addJob,
  editJob,
  removeJob,
};
