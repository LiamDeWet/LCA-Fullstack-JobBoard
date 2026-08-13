<script setup>
//fetching the data from the jobs via node,js api
//axios is used to communicate with the backend api

import { ref, onMounted } from "vue";
import axios from "axios";

//api config
const API_URL = "http://localhost:3000/jobs";

const jobs = ref([]);
const searchTerm = ref("");
const loading = ref(false);
const error = ref("");
const editingJobId = ref(null);

const editForm = ref({
  title: "",
  company: "",
  location: "",
  description: "",
  userId: 1,
});
const editLoading = ref(false);

//fetch jobs
async function fetchJobs() {
  loading.value = true;
  error.value = "";

  try {
    const response = await axios.get("http://localhost:3000/jobs");

    console.log("API response:", response.data);

    jobs.value = response.data;
  } catch (err) {
    console.error("Error fetching jobs:", err);

    error.value = "Unable to load jobs. Please try again.";
  } finally {
    loading.value = false;
  }
}

//delete a job that was posted
async function deleteJob(id) {
  const confirmed = window.confirm("Are you sure you want to delete this job?");

  if (!confirmed) {
    return;
  }
  error.value = "";
  try {
    await axios.delete(`${API_URL}/${id}`);
    await fetchJobs();
  } catch (err) {
    console.error("Error deleting job:", err);
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = "Unable to delete job. Please try again.";
    }
  }
  // Clear any previous error.
  error.value = "";

  try {
    await axios.delete(`${API_URL}/${id}`);

    // Refresh the list so the deleted job disappears.
    await fetchJobs();
  } catch (err) {
    console.error("Error deleting job:", err);

    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = "Unable to delete job. Please try again.";
    }
  }
}

async function updateJob() {
  editLoading.value = true;
  error.value = "";

  try {
    await axios.put(`${API_URL}/${editingJobId.value}`, {
      title: editForm.value.title,
      company: editForm.value.company,
      location: editForm.value.location,
      description: editForm.value.description,
      userId: Number(editForm.value.userId),
    });

    // Close the edit form.
    cancelEdit();

    // Refresh the displayed jobs.
    await fetchJobs();
  } catch (err) {
    console.error("Error updating job:", err);

    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = "Unable to update job. Please try again.";
    }
  } finally {
    editLoading.value = false;
  }
}

function startEdit(job) {
  editingJobId.value = job.id;

  editForm.value = {
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    userId: job.user_id,
  };

  // Clear any previous error.
  error.value = "";
}

function cancelEdit() {
  editingJobId.value = null;

  editForm.value = {
    title: "",
    company: "",
    location: "",
    description: "",
    userId: 1,
  };

  error.value = "";
}

//search jobs
function searchJobs() {
  fetchJobs();
}

//clear search
function clearSearch() {
  searchTerm.value = "";
  fetchJobs();
}

//initial load
onMounted(() => {
  fetchJobs();
});

//expose the function
defineExpose({
  fetchJobs,
});
</script>

<template>
  <section class="job-list">
    <div class="section-header">
      <h2>Job Listings</h2>
      <p>Find your next opportunity.</p>
    </div>

    <!--search-->
    <form class="search-form" @submit.prevent="searchJobs">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by title, company or location"
      />
      <button type="submit">Search</button>

      <button v-if="searchTerm" type="button" @click="clearSearch">
        Clear
      </button>
    </form>

    <!--loading state-->
    <div v-if="loading" class="status-message">Loading jobs...</div>

    <!--error state-->
    <div v-else-if="error" class="status-message error">
      {{ error }}

      <button @click="fetchJobs">Try Again</button>
    </div>

    <!--empty state-->
    <div v-else-if="jobs.length === 0" class="status-message">
      No Jobs Found.
    </div>

    <!--job card-->
    <div v-else class="jobs">
      <article v-for="job in jobs" :key="job.id" class="job-card">
        <!--normal job view-->

        <div v-if="editingJobId !== job.id">
          <h3>{{ job.title }}</h3>

          <p class="company">
            {{ job.company }}
          </p>

          <p>
            <strong>Location:</strong>
            {{ job.location }}
          </p>

          <p>
            {{ job.description }}
          </p>

          <p class="poster">
            Posted by:
            <strong>{{ job.posted_by }}</strong>
          </p>

          <small>
            {{ job.poster_email }}
          </small>

          <!-- Job actions -->
          <div class="job-actions">
            <button type="button" @click="startEdit(job)">Edit</button>

            <button type="button" @click="deleteJob(job.id)">Delete</button>
          </div>
        </div>

        <!--edit job-->

        <form v-else @submit.prevent="updateJob" class="edit-form">
          <h3>Edit Job</h3>

          <div class="form-group">
            <label>Job Title</label>

            <input v-model="editForm.title" type="text" required />
          </div>

          <div class="form-group">
            <label>Company</label>

            <input v-model="editForm.company" type="text" required />
          </div>

          <div class="form-group">
            <label>Location</label>

            <input v-model="editForm.location" type="text" required />
          </div>

          <div class="form-group">
            <label>Description</label>

            <textarea
              v-model="editForm.description"
              rows="5"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>User ID</label>

            <input v-model="editForm.userId" type="number" min="1" required />
          </div>

          <div class="job-actions">
            <button type="submit" :disabled="editLoading">
              {{ editLoading ? "Saving..." : "Save Changes" }}
            </button>

            <button type="button" @click="cancelEdit" :disabled="editLoading">
              Cancel
            </button>
          </div>
        </form>
      </article>
    </div>
  </section>
</template>
