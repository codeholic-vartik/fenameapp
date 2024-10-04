<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  contactInfo: {
    type: Object,
    required: true,
  },
});
// Use the Vue Router
const router = useRouter();

// Method to handle the back navigation
const goBack = () => {
  router.back();
};
</script>

<template>
  <div id="cd-contact-content-wrapper" class="cd-tab-content">
    <h3 class="cd-get-in-touch-heading">{{ contactInfo.title }}</h3>
    <div class="cd-contact-info-box">
      <h6>{{ contactInfo.organization }}</h6>

      <!-- Address Row -->
      <div class="cd-contact-info-p-row">
        <div class="cd-contact-info-p-svg">
          <i fill="currentColor" style="display: inline-block"
            ><svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 64 64"
              style="display: inline-block; vertical-align: middle"
            >
              <circle
                stroke-width="2"
                stroke-miterlimit="10"
                cx="32"
                cy="35"
                r="28.292"
                fill="none"
                stroke="currentColor"
              ></circle>
              <polygon
                stroke-width="2"
                stroke-linejoin="bevel"
                stroke-miterlimit="10"
                points="37,40 45,21 26,29 
                                19,47 "
                fill="none"
                stroke="currentColor"
              ></polygon>
              <line
                stroke-width="2"
                stroke-miterlimit="10"
                x1="26"
                y1="29"
                x2="37"
                y2="40"
                fill="none"
                stroke="currentColor"
              ></line>
              <path
                stroke-width="2"
                stroke-miterlimit="10"
                d="M36.9,7C36.965,6.677,37,6.342,37,6
                                c0-2.761-2.239-5-5-5s-5,2.239-5,5c0,0.342,0.035,0.677,0.1,1"
                fill="none"
                stroke="currentColor"
              ></path>
              <line
                stroke-width="2"
                stroke-miterlimit="10"
                x1="32"
                y1="7"
                x2="32"
                y2="12"
                fill="none"
                stroke="currentColor"
              ></line>
              <line
                stroke-width="2"
                stroke-miterlimit="10"
                x1="32"
                y1="58"
                x2="32"
                y2="63"
                fill="none"
                stroke="currentColor"
              ></line>
              <line
                stroke-width="2"
                stroke-miterlimit="10"
                x1="60"
                y1="35"
                x2="55"
                y2="35"
                fill="none"
                stroke="currentColor"
              ></line>
              <line
                stroke-width="2"
                stroke-miterlimit="10"
                x1="9"
                y1="35"
                x2="4"
                y2="35"
                fill="none"
                stroke="currentColor"
              ></line></svg
          ></i>
        </div>
        <div class="cd-contact-info-p-row-content">{{ contactInfo.address.text }}</div>
      </div>

      <!-- Phone Row -->
      <div class="cd-contact-info-p-row">
        <div class="cd-contact-info-p-svg">
          <i fill="currentColor" style="display: inline-block"
            ><svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 64 64"
              style="display: inline-block; vertical-align: middle"
            >
              <g>
                <rect
                  x="16"
                  y="1"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  width="32"
                  height="62"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="16"
                    y="1"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    width="32"
                    height="62"
                    fill="none"
                    stroke="currentColor"
                  ></rect>
                </rect>
                <line
                  stroke-width="2"
                  stroke-miterlimit="10"
                  x1="28"
                  y1="5"
                  x2="36"
                  y2="5"
                  fill="none"
                  stroke="currentColor"
                >
                  <line
                    stroke-width="2"
                    stroke-miterlimit="10"
                    x1="28"
                    y1="5"
                    x2="36"
                    y2="5"
                    fill="none"
                    stroke="currentColor"
                  ></line>
                </line>
                <line
                  stroke-width="2"
                  stroke-miterlimit="10"
                  x1="16"
                  y1="51"
                  x2="48"
                  y2="51"
                  fill="none"
                  stroke="currentColor"
                >
                  <line
                    stroke-width="2"
                    stroke-miterlimit="10"
                    x1="16"
                    y1="51"
                    x2="48"
                    y2="51"
                    fill="none"
                    stroke="currentColor"
                  ></line>
                </line>
                <line
                  stroke-width="2"
                  stroke-miterlimit="10"
                  x1="16"
                  y1="9"
                  x2="48"
                  y2="9"
                  fill="none"
                  stroke="currentColor"
                >
                  <line
                    stroke-width="2"
                    stroke-miterlimit="10"
                    x1="16"
                    y1="9"
                    x2="48"
                    y2="9"
                    fill="none"
                    stroke="currentColor"
                  ></line>
                </line>
                <circle
                  stroke-width="2"
                  stroke-linejoin="bevel"
                  stroke-miterlimit="10"
                  cx="32"
                  cy="57"
                  r="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    stroke-width="2"
                    stroke-linejoin="bevel"
                    stroke-miterlimit="10"
                    cx="32"
                    cy="57"
                    r="2"
                    fill="none"
                    stroke="currentColor"
                  ></circle>
                </circle>
              </g></svg
          ></i>
        </div>
        <div class="cd-contact-info-p-row-content">{{ contactInfo.phone.text }}</div>
      </div>

      <!-- Email Row -->
      <div class="cd-contact-info-p-row">
        <div class="cd-contact-info-p-svg">
          <i fill="currentColor" style="display: inline-block"
            ><svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 64 64"
              style="display: inline-block; vertical-align: middle"
            >
              <g>
                <rect
                  x="1"
                  y="13"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  width="62"
                  height="37"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="1"
                    y="13"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    width="62"
                    height="37"
                    fill="none"
                    stroke="currentColor"
                  ></rect>
                </rect>
                <polyline
                  stroke-width="2"
                  stroke-miterlimit="10"
                  points="1,13 32,33 63,13 	"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline
                    stroke-width="2"
                    stroke-miterlimit="10"
                    points="1,13 32,33 63,13 	"
                    fill="none"
                    stroke="currentColor"
                  ></polyline>
                </polyline>
              </g></svg
          ></i>
        </div>
        <div class="cd-contact-info-p-row-content">
          <a :href="'mailto:' + contactInfo.email.text">{{ contactInfo.email.text }}</a>
        </div>
      </div>

      <!-- Website Row -->
      <div class="cd-contact-info-p-row">
        <div class="cd-contact-info-p-svg">
          <i fill="currentColor" style="display: inline-block">
            <svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 64 64"
              style="display: inline-block; vertical-align: middle"
            >
              <path
                stroke-width="2"
                stroke-miterlimit="10"
                d="M32.001,0.887c17.184,0,31.113,13.929,31.112,31.113
                                        C63.114,49.185,49.184,63.115,32,63.113C14.815,63.114,0.887,49.185,0.888,32.001C0.885,14.816,14.815,0.887,32.001,0.887z"
                fill="none"
                stroke="currentColor"
              ></path>
              <line
                stroke-width="2"
                stroke-miterlimit="10"
                x1="32"
                y1="1"
                x2="32"
                y2="63"
                fill="none"
                stroke="currentColor"
              ></line>
              <line
                stroke-width="2"
                stroke-miterlimit="10"
                x1="63"
                y1="32"
                x2="1"
                y2="32"
                fill="none"
                stroke="currentColor"
              ></line>
              <path
                stroke-width="2"
                stroke-miterlimit="10"
                d="M30,1c0,0-14,11-14,31s14,31,14,31"
                fill="none"
                stroke="currentColor"
              ></path>
              <path
                stroke-width="2"
                stroke-miterlimit="10"
                d="M34,1c0,0,14,11,14,31S34,63,34,63"
                fill="none"
                stroke="currentColor"
              ></path>
              <path
                stroke-width="2"
                stroke-miterlimit="10"
                d="M8,12c0,0,5,10,24,10s24-10,24-10"
                fill="none"
                stroke="currentColor"
              ></path>
              <path
                stroke-width="2"
                stroke-miterlimit="10"
                d="M8,52c0,0,5-10,24-10s24,10,24,10"
                fill="none"
                stroke="currentColor"
              ></path>
            </svg>
          </i>
        </div>
        <div class="cd-contact-info-p-row-content">
          <a :href="contactInfo.website.text" target="_blank">{{
            contactInfo.website.text
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.back-btn {
  text-align: center;
}
</style>
