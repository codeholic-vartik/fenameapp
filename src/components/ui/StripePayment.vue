<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";


var stripe = Stripe(
  "pk_test_51NUk21SIEdB53S48z9NqK7bQVjwUHQXfbjbMy75sEW82Bc8gQOgRWIt2qCvt9zqK5aWEfQkuIHjF81wLGt5BGMPG00ghFv2Zm8"
);

// Fetch the client secret from your server
const response = await fetch(
  "http://localhost/vartik/wowspace/wordpress/wp-json/stripe/v1/create-payment-intent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }
);
// if (!response.ok) {
//   const errorData = await response.json();
//   console.error("Error fetching client secret:", errorData);
//   return;
// }

const { clientSecret } = await response.json();
console.log("Client secret:", clientSecret);
</script>

<template>
  <Suspense>
    <template #default>
      <div>Stripe doc</div>
    </template>
    <template #fallback>
      <div>Loading...</div> <!-- Optional loading state -->
    </template>
  </Suspense>
</template>


<style></style>
