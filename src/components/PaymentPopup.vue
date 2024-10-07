<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { API_BASE_URL, BAMBORA_PAYMENT_ROUTE_PATH } from "@/config/config.js";
const props = defineProps({
  amount: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["close"]);
const defaultAmount = parseInt(props.amount);
const step = ref(1);
const apiResponse = ref(null);
const isLoading = ref(false);
const error = ref(null);
const envVariable = ref(import.meta.env);
watch(
  () => props.amount,
  (newAmount) => {
    donationDetails.value.amount = newAmount;
  }
);

const userInfo = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
});

const donationDetails = ref({
  amount: props.amount,
  paymentType: "paypal",
  payment_recurring_type: "one_time",
  payment_recurring_type_value: "",
});

const paymentDetails = ref({
  cardholderName: "",
  cardNumber: "",
  expirationMonth: "",
  expirationYear: "",
  cvv: "",
  accountNumber: "",
  transitNumber: "",
  institutionNumber: "",
  paypalEmail: "",
});

// Handel next steps
const handleNextStep = () => {
  if (step.value === 1 && validateUserInfo()) {
    step.value = 2;
  } else if (step.value === 2 && validateDonationDetails()) {
    step.value = 1;
  }
};

// Handel previous step
const handlePreviousStep = () => {
  step.value = step.value - 1;
};

const validateUserInfo = () => {
  // Add validation logic for user info
  return true;
};

const validateDonationDetails = () => {
  // Add validation logic for donation details
  return true;
};

// reset form value
const resetForm = () => {
  userInfo.value = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  };
  donationDetails.value = {
    amount: props.amount,
    paymentType: "",
    payment_recurring_type: "one_time",
    payment_recurring_type_value: "",
  };
  paymentDetails.value = {
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    accountNumber: "",
    transitNumber: "",
    institutionNumber: "",
    paypalEmail: "",
  };
};

const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  isLoading.value = true; // Set the loading state
  apiResponse.value = null; // Clear previous API response
  error.value = null; // Clear previous error

  // Collecting form data
  const formData = {
    userInfo: userInfo.value,
    donationDetails: donationDetails.value,
    paymentDetails: paymentDetails.value,
  };
  // console.log(formData); // Log form data for debugging

  try {
    // console.log(    `${API_BASE_URL}${BAMBORA_PAYMENT_ROUTE_PATH}`)
    // Make the API call using fetch
    const response = await fetch(`${API_BASE_URL}${BAMBORA_PAYMENT_ROUTE_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type
      },
      body: JSON.stringify(formData), // Send form data as JSON
    });

    // console.log(response); // Log the raw response for debugging

    // Check for HTTP status codes and handle accordingly
    if (!response.ok) {
      const errorData = await response.json(); // Extract error details from the response

      // Handle different HTTP status codes
      switch (response.status) {
        case 400:
          throw new Error("Bad Request: Please check the information provided.");
        case 401:
          throw new Error("Unauthorized: Please log in and try again.");
        case 403:
          throw new Error(
            "Forbidden: You do not have permission to perform this action."
          );
        case 404:
          throw new Error("Not Found: The requested resource could not be found.");
        case 500:
          if (errorData.code === "curl_error") {
            throw new Error(
              `Network Error: ${errorData.message}. Please try again later.`
            );
          } else {
            throw new Error(
              "Server Error: An unexpected error occurred. Please try again later."
            );
          }
        default:
          throw new Error(
            `Payment failed: ${errorData.message || "An unexpected error occurred."}`
          );
      }
    }

    // Assuming successful response processing
    // const data = await response.json(); // Uncomment this if you want to process the response data
    apiResponse.value = "Payment successful! Thank you for your donation."; // Success message
    console.log("API Response:", apiResponse.value);
  } catch (err) {
    console.error("API Error:", err.message); // Log the error message for debugging
    error.value = `${err.message}`; // Set the error message in the UI
  } finally {
    isLoading.value = false; // Stop loading indicator
  }
};

const currentYear = new Date().getFullYear();

const months = ref([
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
]);

const years = ref([]);
for (let i = 0; i <= 10; i++) {
  years.value.push(currentYear + i);
}
</script>

<template>
  <div class="backdrop" v-if="true">
    <div class="cd-loading" v-if="isLoading">
      <span class="loader"></span>

      <p class="cd-model-loading-title">Processing your payment, please wait...</p>
    </div>

    <!-- Form Content -->
    <div class="backdrop" v-else-if="!apiResponse && !error">
      <div class="donation-modal donation-model-bg">
        <div class="donate-box">
          <button type="button" class="cross-icon" @click="$emit('close')">X</button>
          <div class="cd-model-title">
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
          </div>
          <div class="cd-separator"></div>

          <div v-if="step === 1" class="cd-form-section">
            <form @submit.prevent="handleNextStep">
              <div class="cd-form-input">
                <div class="cd-form-content">
                  <div>
                    <label for="first-name">First Name</label>
                    <input
                      class="cd-input-field"
                      v-model="userInfo.firstName"
                      id="first-name"
                      type="text"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <label for="last-name">Last Name</label>
                    <input
                      class="cd-input-field"
                      v-model="userInfo.lastName"
                      id="last-name"
                      type="text"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  <label for="email">Email</label>
                  <input
                    class="cd-input-field"
                    v-model="userInfo.email"
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <label for="phone">Phone</label>
                  <input
                    class="cd-input-field"
                    v-model="userInfo.phone"
                    id="phone"
                    type="tel"
                    placeholder="Phone"
                    required
                  />
                  <label for="address">Address</label>
                  <textarea
                    cols=""
                    class="cd-input-field"
                    v-model="userInfo.address"
                    id="address"
                    type="text"
                    placeholder="Address"
                    required
                    autocomplete
                  ></textarea>
                </div>
                <div class="cd-btn-right">
                  <button class="cd-card-donate-btn" type="submit">Next</button>
                </div>
              </div>
            </form>
          </div>
          <div v-if="step === 2" class="cd-form-section cd-form-full-height">
            <form @submit.prevent="handleNextStep" class="cd-form-input">
              <div class="cd-model-form">
                <div>
                  <label for="amount">Amount</label>
                  <input
                    class="cd-input-field"
                    v-model="donationDetails.amount"
                    id="amount"
                    type="number"
                    step="1"
                    min="1"
                    required
                  />
                  <!-- Recurring payment type  -->
                  <div class="">
                    <label class="cd-toggle-label" for="recurring-payment">
                      How Often?
                    </label>
                    <div class="cd-toggle-buttons">
                      <button
                        :class="{
                          'cd-toggle-selected':
                            donationDetails.payment_recurring_type === 'one_time',
                          'cd-toggle-unselected':
                            donationDetails.payment_recurring_type !== 'one_time',
                        }"
                        class="cd-toggle-button"
                        type="button"
                        @click="donationDetails.payment_recurring_type = 'one_time'"
                      >
                        One-time Payment
                      </button>
                      <button
                        :class="{
                          'cd-toggle-selected':
                            donationDetails.payment_recurring_type === 'recurring',
                          'cd-toggle-unselected':
                            donationDetails.payment_recurring_type !== 'recurring',
                        }"
                        class="cd-toggle-button"
                        type="button"
                        @click="donationDetails.payment_recurring_type = 'recurring'"
                      >
                        Recurring Payment
                      </button>
                    </div>
                    <!-- Recurring payment type value  Template -->
                    <template
                      v-if="donationDetails.payment_recurring_type === 'recurring'"
                    >
                      <div class="cd-recurring-options">
                        <button
                          :class="{
                            'cd-toggle-selected':
                              donationDetails.payment_recurring_type_value === 'daily',
                            'cd-toggle-unselected':
                              donationDetails.payment_recurring_type_value !== 'daily',
                          }"
                          class="cd-toggle-button cd-toggle-button-child"
                          type="button"
                          @click="donationDetails.payment_recurring_type_value = 'daily'"
                        >
                          Daily
                        </button>
                        <button
                          :class="{
                            'cd-toggle-selected':
                              donationDetails.payment_recurring_type_value === 'weekly',
                            'cd-toggle-unselected':
                              donationDetails.payment_recurring_type_value !== 'weekly',
                          }"
                          class="cd-toggle-button cd-toggle-button-child"
                          type="button"
                          @click="donationDetails.payment_recurring_type_value = 'weekly'"
                        >
                          Weekly
                        </button>
                        <button
                          :class="{
                            'cd-toggle-selected':
                              donationDetails.payment_recurring_type_value === 'monthly',
                            'cd-toggle-unselected':
                              donationDetails.payment_recurring_type_value !== 'monthly',
                          }"
                          class="cd-toggle-button cd-toggle-button-child"
                          type="button"
                          @click="
                            donationDetails.payment_recurring_type_value = 'monthly'
                          "
                        >
                          Monthly
                        </button>
                      </div>
                    </template>
                  </div>
                  <!-- Group Button Start  -->
                  <div>
                    <label for="payment-type">Select Payment Method</label>
                    <div class="cd-group-btn" id="payment-type">
                      <button
                        :class="{
                          'cd-card-donate-btn': donationDetails.paymentType === 'paypal',
                          'cd-card-donate-btn-unselected':
                            donationDetails.paymentType !== 'paypal',
                        }"
                        @click="donationDetails.paymentType = 'paypal'"
                        type="button"
                      >
                        PayPal
                      </button>

                      <!-- Value is changed from credit_card to card  07-10-2024  -->
                      <button
                        :class="{
                          'cd-card-donate-btn': donationDetails.paymentType === 'card',
                          'cd-card-donate-btn-unselected':
                            donationDetails.paymentType !== 'card',
                        }"
                        @click="donationDetails.paymentType = 'card'"
                        type="button"
                      >
                        Credit Card
                      </button>
                      <button
                        :class="{
                          'cd-card-donate-btn':
                            donationDetails.paymentType === 'bank_account',
                          'cd-card-donate-btn-unselected':
                            donationDetails.paymentType !== 'bank_account',
                        }"
                        @click="donationDetails.paymentType = 'bank_account'"
                        type="button"
                      >
                        Bank Account
                      </button>
                    </div>
                  </div>
                  <!-- Group Button End  -->
                  <!-- Credit card template Start  -->
                  <template v-if="donationDetails.paymentType === 'card'">
                    <label for="card-number">Cardholder Name</label>
                    <input
                      v-model="paymentDetails.cardholderName"
                      id="cardholder-name"
                      type="text"
                      placeholder="Cardholder Name"
                      required
                      class="cd-input-field"
                    />
                    <label for="card-number">Card Number</label>
                    <input
                      v-model="paymentDetails.cardNumber"
                      id="card-number"
                      type="number"
                      placeholder="Card Number"
                      required
                      class="cd-input-field"
                    />
                    <div class="cd-payment-card">
                      <div>
                        <label for="expiration-month">Exp Month</label>
                        <input
                          list="months"
                          v-model="paymentDetails.expirationMonth"
                          id="expiration-month"
                          type="number"
                          min="01"
                          max="12"
                          step="01"
                          placeholder="MM"
                          required
                          class="cd-input-field"
                        />
                        <datalist id="months">
                          <option v-for="month in months" :key="month" :value="month">
                            {{ month }}
                          </option>
                        </datalist>
                      </div>
                      <div>
                        <label for="expiration-year">Exp Year</label>
                        <input
                          list="years"
                          v-model="paymentDetails.expirationYear"
                          id="expiration-year"
                          min="1"
                          step="1"
                          type="number"
                          placeholder="YYYY"
                          required
                          class="cd-input-field"
                        />
                        <datalist id="years">
                          <option v-for="year in years" :key="year" :value="year">
                            {{ year }}
                          </option>
                        </datalist>
                      </div>
                      <div>
                        <label for="cvv">CVV</label>
                        <input
                          v-model="paymentDetails.cvv"
                          id="cvv"
                          type="text"
                          placeholder="CVV"
                          required
                          class="cd-input-field"
                        />
                      </div>
                    </div>
                  </template>
                  <!-- Credit card template End  -->
                  <template v-if="donationDetails.paymentType === 'bank_account'">
                    <label for="account-number">Account Number</label>
                    <input
                      v-model="paymentDetails.accountNumber"
                      id="account-number"
                      type="text"
                      required
                    />
                    <label for="transit-number">Transit Number</label>
                    <input
                      v-model="paymentDetails.transitNumber"
                      id="transit-number"
                      type="text"
                      required
                    />
                    <label for="institution-number">Institution Number</label>
                    <input
                      v-model="paymentDetails.institutionNumber"
                      id="institution-number"
                      type="text"
                      required
                    />
                  </template>
                  <template v-if="donationDetails.paymentType === 'paypal'">
                    <!-- <label for="paypal-email">PayPal</label> -->
                    <div id="paypal-button-container"></div>
                  </template>
                </div>
              </div>
              <!-- Submit button will be hidden for the paypal payment type  -->
              <div class="cd-btn-model cd-absolute">
                <button class="cd-back-btn" type="button" @click="handlePreviousStep">
                  Back
                </button>
                <button
                  v-if="
                    donationDetails.paymentType === 'card' ||
                    donationDetails.paymentType === 'bank_account'
                  "
                  class="cd-card-donate-btn cd-next-btn cd-absolute-right"
                  type="submit"
                  @click="handleSubmit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success or Error Message -->
    <div v-if="apiResponse || error" class="response-message">
      <div class="donation-modal success-box">
        <div class="donate-box success-box">
          <div class="cross-container">
            <button type="button" class="cross-icon" @click="$emit('close')">X</button>
          </div>

          <p v-if="apiResponse" class="success-message">
            {{ apiResponse }}
          </p>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  width: 100%;
}

.donation-model-bg {
  background-image: url("https://donorchoice.ca/static/media/bg3.cc8a356cb29a8e79a789.jpg");
  background-color: #007c16;
  background-position: right;
  background-repeat: no-repeat;
  background-size: cover;
}

.donation-modal {
  align-items: flex-end;

  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  padding: 15px;
  width: 100%;
  max-width: 900px;
  height: 80%;
  animation: animate-modal 0.6s forwards;
}

@keyframes animate-modal {
  0% {
    transform: translateY(0px);
    opacity: 0;
  }

  100% {
    transform: translateY(20px);
    opacity: 1;
  }
}

@media screen and (max-width: 920px) {
  .donation-modal {
    max-width: 100vw;
    width: auto;
    height: 90%;
  }
}

.cd-group-btn {
  display: flex;
  gap: 20px;
  margin: 10px 0px;
}
.backdrop {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  height: 100dvh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;
}

.donate-box {
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex: 1 1;
  flex-direction: column;
  overflow-y: auto;
  padding: 15px;
  position: relative;
  width: 100%;
  max-width: 500px;
}

.cross-icon {
  cursor: pointer;
  position: absolute;
  right: 12px;
  top: 13px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #222;
  z-index: 10;
}

.often-btns-group button {
  margin: 5px;
}

.back-and-next-div {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cd-toggle-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0px;
  gap: 3vw;
}

.cd-toggle-button {
  padding: 10px 20px;
  border: 2px solid green;
  border-radius: 4px;
  background-color: white;
  color: green;
  cursor: pointer;
  font-size: 16px;
  border-radius: 40px;
  transition: background-color 0.3s, color 0.3s;
}

.cd-toggle-selected {
  min-width: 8vw;
  background-color: green;
  color: white;
  border-color: green;
}
.cd-toggle-button-child {
  padding: 7px;
}

.cd-toggle-unselected {
  min-width: 8vw;
  background-color: white;
  color: green;
}

.cd-payment-card {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.cd-loading {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #387d1c;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.success-message {
  color: green;
  font-weight: bold;
}

.error-message {
  color: red;
  font-weight: bold;
}

.cd-model-loading-title {
  margin-top: 4px;
  font-size: 12px;
  color: #fff;
}

.success-box {
  display: flex;
  flex-direction: column;
  min-height: 20vh;
  min-width: 400px;
  justify-content: center;
  align-items: center;
}
</style>
