//import express to manage the rest api server then cors for vue frontend and node.js as well as dotenv and the pool
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");

const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJob,
} = require("./models/jobModel");

//creating the app
const app = express();
app.use(cors());
app.use(express.json());

app.use("/jobs", jobRoutes);

//database connections
async function testDatabaseConnection() {
  try {
    const [rows] = await pool.execute("SELECT 1 AS connection_test");
    console.log("Database connected successfully:", rows);
  } catch (error) {
    console.error("databse connection failed:", error.message);
  }
}

testDatabaseConnection();

//server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("JobBoard ZA API running on port ${PORT");
});
