//the database queries for the jobs, connection to MySQL
const pool = require("../config/db");

//get all jobs
async function getAllJobs() {
  const [rows] = await pool.execute(`
    SELECT
    jobs.id,
    jobs.title,
    jobs.company,
    jobs.location,
    jobs.description,
    jobs.user_id,
    jobs.created_at,
    users.name AS posted_by,
    users.email AS poster_email
    FROM jobs
    INNER JOIN users
      ON jobs.user_id = users.id
    ORDER BY jobs.created_at DESC`);

  return rows;
}

//get the job by id
async function getJobById(id) {
  const [rows] = await pool.execute(
    `SELECT
      jobs.id,
      jobs.title,
      jobs.company,
      jobs.location,
      jobs.description,
      jobs.user_id,
      jobs.created_at,
      users.name AS posted_by,
      users.email AS poster_email
    FROM jobs
    INNER JOIN users
      ON jobs.user_id = users.id
    WHERE jobs.id = ?`,
    [id],
  );

  return rows;
}

//create job
async function createJob(title, company, location, description, userId) {
  const [result] = await pool.execute(
    `
      INSERT INTO jobs
        (title, company, location, description, user_id)
      VALUES (?, ?, ?, ?, ?)
    `,
    [title, company, location, description, userId],
  );

  return result;
}

//update job
async function updateJob(id, title, company, location, description, userId) {
  const [result] = await pool.execute(
    `UPDATE jobs
    SET
      title = ?,
      company = ?,
      location = ?,
      description =?,
      user_id = ?
    WHERE id = ?`,
    [title, company, location, description, userId, id],
  );

  return result;
}

//delete job
async function deleteJob(id) {
  const [result] = await pool.execute("DELETE FROM jobs WHERE id = ?", [id]);

  return result;
}

//stretch goal search jobs
async function searchJob(searchTerm) {
  const searchPattern = `%${searchTerm}%`;

  const [rows] = await pool.execute(
    `
      SELECT 
        jobs.id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.description,
        jobs.user_id,
        jobs.created_at,
        users.name AS posted_by,
        users.email AS poster_email
      FROM jobs
      INNER JOIN users
        ON jobs.user_id = users.id
      WHERE
        jobs.title LIKE ?
        OR jobs.company LIKE ?
        OR jobs.location LIKE ?
      ORDER BY jobs.created_at DESC
    `,
    [searchPattern, searchPattern, searchPattern],
  );

  return rows;
}

//export model functions
module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJob,
};
