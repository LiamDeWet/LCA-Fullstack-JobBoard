<script setup>
//main app component

import { ref } from "vue";

import JobList from "./components/JobList.vue";
import PostJobForm from "./components/PostJobForm.vue";

// Used to tell JobList when it needs to refresh.
const jobListRef = ref(null);

//refresh the jobs

function refreshJobs() {
  if (jobListRef.value) {
    jobListRef.value.fetchJobs();
  }
}
</script>

<template>
  <div class="app">
    <header>
      <h1>JobBoard ZA</h1>

      <p>Find and manage job opportunities across South Africa.</p>
    </header>

    <!-- Job creation form -->
    <PostJobForm @job-created="refreshJobs" />

    <!-- Job listing -->
    <JobList ref="jobListRef" />
  </div>
</template>
