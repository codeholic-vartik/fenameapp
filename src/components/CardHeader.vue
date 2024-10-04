<script setup>
import logo from "../assets/images/202.png";
import { ref, onMounted } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const data = ref(props.data);
</script>
<template>
  <div class="cd-container">
    <div class="cd-card-container cd-single-card">
      <div class="cd-custom-card cd-single-card">
        <!-- Logo and title  -->
        <header class="cd-card-header">
          <div class="cd-leftside-card">
            <div class="cd-card-logo">
              <img :src="data.image" alt="card-logo-img" />
            </div>
            <div class="cd-title-and-country">
              <div class="cd-organization-name">{{ data.title }}</div>
              <div class="cd-city-and-country-name">{{ data.description }}</div>
            </div>
          </div>
          <!-- Follow Button  -->
          <!-- <div class="cd-rightside-card">
            <button class="cd-card-follow-btn">Follow</button>
          </div> -->
        </header>
      </div>
    </div>
  </div>
</template>

<style></style>
