<script setup>
import PaymentPopup from './PaymentPopup.vue';
import { ref } from 'vue';

// Define props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// Reactive state
const showPopup = ref(false);
const amount = ref('');

// Default value
const defaultAmount = 1; 

// Function to handle form submission
const handleSubmit = (e) => {
  e.preventDefault(); // Prevent form from submitting the default way

  const donationAmount = e.target.elements['donation-amount'].value;
  
  // Check if amount is provided, otherwise use default amount
  amount.value = donationAmount ? donationAmount : defaultAmount;

  showPopup.value = true; // Show the popup
};

// Function to close the popup
const closePopup = () => {
  showPopup.value = false; // Hide the popup
};
</script>

<template>
  <div class="cd-container">
    <div class="cd-card-container cd-single-card">
      <div class="cd-custom-card cd-single-card">
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
          <!-- <div class="cd-rightside-donation-card">
            <div class="cd-donation-box">
              <div class="cd-donation-text">
                <div>Enter Donation Amount</div>
                <div class="cd-minimum-amount-msg">
                  Minimum Amount ${{ data.minDonatationAmount }}
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
          </div> -->
        </header>
      </div>
    </div>
    <!-- PaymentPopup component -->
    <!-- <PaymentPopup v-if="showPopup" @close="closePopup" :amount="amount" :title="data.title" :description="data.description" /> -->
  </div>
</template>

<style>
/* Add your styles here */
</style>
