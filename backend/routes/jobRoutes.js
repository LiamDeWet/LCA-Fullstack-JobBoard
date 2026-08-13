//define the http endpoints for the job resource
const express = require("express");
const router = express.Router();

//controller functions import
const {
  getJobs,
  getJob,
  addJob,
  editJob,
  removeJob,
} = require("../controllers/jobController");

//job endpoints
router.get("/", getJobs);
router.get("/:id", getJob);
router.post("/", addJob);
router.put("/:id", editJob);
router.delete("/:id", removeJob);
module.exports = router;
