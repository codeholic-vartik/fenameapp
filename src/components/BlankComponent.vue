<script setup>
import { useRouter } from "vue-router";
import PaymentPopup from './PaymentPopup.vue';

import { ref } from "vue";

const props = defineProps({
  msg: {
    type: String,
  },

  data: {
    type: Object,
    required: true,
  },
});

const data = ref(props.data);
// console.log("Blank Component", JSON.stringify(props.data, null, 2));
// Use the Vue Router
const router = useRouter();

// Reactive state
const showPopup = ref(false);
const amount = ref("");

// Default value
const defaultAmount = 1;

const handleSubmit = (e) => {
  e.preventDefault(); // Prevent form from submitting the default way

  const donationAmount = e.target.elements["donation-amount"].value;

  // Check if amount is provided, otherwise use default amount
  amount.value = donationAmount ? donationAmount : defaultAmount;

  showPopup.value = true; // Show the popup
};
// Function to close the popup
const closePopup = () => {
  showPopup.value = false; // Hide the popup
};
// Method to handle the back navigation
const goBack = () => {
  router.push({ name: "home" });
};
</script>

<template>
  <div id="cd-campaign-content-wrapper" class="cd-tab-content">
    <div class="cd-campaign-msg">{{ msg }}</div>
    <div class="cd-center-donation-card">
      <div class="cd-donation-box cd-donation-card-shadow">
        <div class="cd-donation-text">
          <div>Enter Donation Amount</div>
          <div class="cd-minimum-amount-msg">
            Minimum Amount
             ${{ data.minDonatationAmount }}
          </div>
        </div>

        <div class="cd-donation-form">
          <form class="cd-form-container" @submit="handleSubmit">
            <input
              aria-invalid="false"
              autocomplete="off"
              id="donation-amount"
              placeholder="Amount"
              required
              type="number"
              class="cd-input-field"
                                  :value = data.minDonatationAmount

            />
            <button type="submit" class="cd-card-donate-btn">DONATE</button>
          </form>
        </div>
      </div>
    </div>
    <div class="cd-campaign-box">
      <div class="cd-rightside-card">
        <button class="cd-card-back-btn" @click="goBack">BACK</button>
      </div>
    </div>
  </div>
  <PaymentPopup
    v-if="showPopup"
    @close="closePopup"
    :amount="amount"
    :title="data.title"
    :description="data.description"
  />
</template>

<style>
.cd-card-back-btn {
  background-color: initial;
  border: 1px solid #007c16;
  color: #007c16;
  margin: 10px auto;
  outline: none;
  padding: 10px 24px;
  cursor: pointer;
}

.cd-center-donation-card {
  display: flex;
  justify-content: center;
  margin: 20px 0px 20px 0px;
}

.cd-donation-card-shadow {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  background-color: white;
}

.cd-rightside-card{
  margin-top: 20px;
}
</style>
