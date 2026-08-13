<script setup>
//creating a new job

import { ref } from "vue";
import axios from "axios";

//api config
const API_URL = "http://localhost:3000/jobs";

//form data
const title = ref("");
const company = ref("");
const location = ref("");
const description = ref("");
const userId = ref(1);

//UI load state
const loading = ref(false);
const error = ref("");
const success = ref("");

//using emit to refresh the job list after a new job has been created
const emit = defineEmits(["job-created"]);

//function to add job
async function addJob() {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    const response = await axios.post(API_URL, {
      title: title.value,
      company: company.value,
      location: location.value,
      description: description.value,
      userId: Number(userId.value),
    });

    console.log("Job created:", response.data);

    success.value = "Job posted successfully!";

    // Tell the parent component that a job was created.
    emit("job-created");

    // Clear the form after successful submission.
    title.value = "";
    company.value = "";
    location.value = "";
    description.value = "";
  } catch (err) {
    console.error("Error creating job:", err);

    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = "Unable to create job. Please try again.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="post-job">
    <h2>Post a Job</h2>

    <form @submit.prevent="addJob">
      <div class="form-group">
        <label for="title">Job Title</label>

        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="e.g. Junior Web Developer"
          required
        />
      </div>

      <!--company-->
      <div class="form-group">
        <label for="company">Company</label>

        <input
          id="company"
          v-model="company"
          type="text"
          placeholder="Company name"
          required
        />
      </div>

      <!--location-->
      <div class="form-group">
        <label for="location">Location</label>

        <input
          id="location"
          v-model="location"
          type="text"
          placeholder="e.g. Cape Town"
          required
        />
      </div>

      <!--description-->
      <div class="form-group">
        <label for="description">Description</label>

        <textarea
          id="description"
          v-model="description"
          placeholder="Describe the job..."
          rows="5"
          required
        ></textarea>
      </div>

      <!--user id-->
      <div class="form-group">
        <label for="userId">User ID</label>

        <input id="userId" v-model="userId" type="number" min="1" required />
      </div>

      <!--error message-->
      <p v-if="error" class="form-error">
        {{ error }}
      </p>

      <p v-if="success" class="form-success">
        {{ success }}
      </p>

      <button type="submit" :disabled="loading">
        {{ loading ? "Posting..." : "Post Job" }}
      </button>
    </form>
  </section>
</template>
