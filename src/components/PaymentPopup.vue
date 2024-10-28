<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import {
  API_BASE_URL,
  BAMBORA_PAYMENT_ROUTE_PATH,
  STRIPE_PUBLISHED_KEY,
  CREATE_STRIPE_PAYMENT_INTENT_ROUTE,
  CREATE_STRIPE_CREATE_PAYMENT_ROUTE,
} from "@/config/config.js";

import {formatText} from "@/config/support.js";
import { Country, State, City } from "country-state-city";
import StripePayment from "@/components/ui/StripePayment.vue";

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
const years = ref([]);
const selectedCountry = ref("");
const cities = ref([]);
const states = ref([]);
const stripe = ref(null);
const stripeElements = ref(null);
const stripePaymentElement = ref(null);
const stripeClientSecret = ref(null);
const loadingStripe = ref(false);
const stripePaymentIntentId = ref(null);
const isStripeLoading = ref(false);
const campaignName = ref(props.title);
console.log(formatText(campaignName.value));




watch(
  () => props.amount,
  (newAmount) => {
    donationDetails.value.amount = newAmount;
  }
);

const handleRecurringChange = () => {
  if (donationDetails.value.payment_recurring_type === "recurring") {
    // donationDetails.value.paymentType = "card";
  }
};

const userInfo = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  postal_code: "",
});

const donationDetails = ref({
  campaignName: formatText(campaignName.value),
  amount: props.amount,
  paymentType: "paypal",
  payment_recurring_type: "one_time",
  payment_recurring_type_value: "monthly",
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
  country: "",
  countryCode: "",
  city: "",
  province: "",
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
    postal_code: "",
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
    country: "",
    city: "",
    province: "",
  };
};

// commented on 16-10-2024
// const handleSubmit = async (event) => {
//   event.preventDefault(); // Prevent the default form submission behavior
//   isLoading.value = true; // Set the loading state
//   apiResponse.value = null; // Clear previous API response
//   error.value = null; // Clear previous error

//   // Collecting form data
//   const formData = {
//     userInfo: userInfo.value,
//     donationDetails: donationDetails.value,
//     paymentDetails: paymentDetails.value,
//   };
//   console.log(formData); // Log form data for debugging

//   try {
//     // console.log(    `${API_BASE_URL}${BAMBORA_PAYMENT_ROUTE_PATH}`)
//     // Make the API call using fetch
//     const response = await fetch(`${API_BASE_URL}${BAMBORA_PAYMENT_ROUTE_PATH}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json", // Specify the content type
//       },
//       body: JSON.stringify(formData), // Send form data as JSON
//     });

//     console.log(response);
//     // console.log(response); // Log the raw response for debugging

//     // Check for HTTP status codes and handle accordingly
//     if (!response.ok) {
//       const errorData = await response.json(); // Extract error details from the response

//       // Handle different HTTP status codes
//       switch (response.status) {
//         case 400:
//           throw new Error("Bad Request: Please check the information provided.");
//         case 401:
//           throw new Error("Unauthorized: Please log in and try again.");
//         case 403:
//           throw new Error(
//             "Forbidden: You do not have permission to perform this action."
//           );
//         case 404:
//           throw new Error("Not Found: The requested resource could not be found.");
//         case 500:
//           if (errorData.code === "curl_error") {
//             throw new Error(
//               `Network Error: ${errorData.message}. Please try again later.`
//             );
//           } else {
//             throw new Error(
//               "Server Error: An unexpected error occurred. Please try again later."
//             );
//           }
//         default:
//           throw new Error(
//             `Payment failed: ${errorData.message || "An unexpected error occurred."}`
//           );
//       }
//     }

//     // Assuming successful response processing
//     // const data = await response.json(); // Uncomment this if you want to process the response data
//     apiResponse.value = "Payment successful! Thank you for your donation."; // Success message
//     // console.log("API Response:", response);
//   } catch (err) {
//     console.error("API Error:", err.message); // Log the error message for debugging
//     error.value = `${err.message}`; // Set the error message in the UI
//   } finally {
//     isLoading.value = false; // Stop loading indicator
//   }
// };

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
const countryList = ref({});

// Retrieve all countries from the library
const countries = Country.getAllCountries();
// console.log(countries.length);
// Populate the countryList with country codes as keys and names as values
countries.forEach((country) => {
  countryList.value[country.isoCode] = country.name;
});
const provinceList = ref({
  CA: "Canadian account",
  CS: "U.S. Corporate Savings account",
  CC: "U.S. Corporate Checking account",
  PS: "U.S. Personal Saving account",
  PC: "U.S. Personal Checking account",
});
// Update country details based on user input

const updateCountryDetails = () => {
  const code = Object.keys(countryList.value).find(
    (key) => countryList.value[key] === selectedCountry.value
  );

  // Update paymentDetails with both country code and name
  if (code) {
    paymentDetails.value.countryCode = code; // Set the country code
    paymentDetails.value.country = selectedCountry.value; // Set the country name
    selectCountry(paymentDetails.value.country);
  } else {
    paymentDetails.value.countryCode = ""; // Reset if not found
    paymentDetails.value.country = ""; // Reset if not found
  }
};

// Generate years for expiration date
for (let i = 0; i <= 10; i++) {
  years.value.push(currentYear + i);
}
const isOpen = ref(false);
const isProvince = ref(false);
// Watcher for recurring payment type
watch(
  () => donationDetails.value.payment_recurring_type,
  (newValue) => {
    if (newValue === "recurring") {
      donationDetails.value.paymentType = "card";
    }
  }
);
// / Watch for selected country changes
watch(selectedCountry, (newCountry) => {
  // Update country details in paymentDetails
  const code = Object.keys(countryList.value).find(
    (key) => countryList.value[key] === newCountry
  );
  if (code) {
    paymentDetails.value.countryCode = code;
    paymentDetails.value.country = newCountry;
  } else {
    paymentDetails.value.countryCode = "";
    paymentDetails.value.country = "";
  }
});

// Function to handle country selection
const selectCountryName = (country) => {
  selectedCountry.value = country; // Update the selected country
  closeDropdown(); // Close the dropdown
};

// Open dropdown
const openDropdown = () => {
  isOpen.value = true;
  isProvince.value = false;
};

// Close dropdown
const closeDropdown = () => {
  isOpen.value = false;
};

const filteredProvinces = ref([]);

// Function to filter provinces based on user input
const filterProvinces = () => {
  const input = paymentDetails.value.province.toLowerCase();
  filteredProvinces.value = Object.entries(provinceList).filter(
    ([code, name]) =>
      name.toLowerCase().includes(input) || code.toLowerCase().includes(input)
  );
  selectedIndex.value = -1; // Reset selected index
  isOpen.value = filteredProvinces.value.length > 0; // Open dropdown if there are options
};

// Function to open the dropdown
const openDropdownProvince = () => {
  isProvince.value = true;
  isOpen.value = false;
};

// Function to close the dropdown
const closeDropdownProvince = () => {
  isProvince.value = false;
};
const selectedIndex = ref(-1);

// Function to select a province
const selectProvinceName = (name) => {
  paymentDetails.value.province = name;
  isProvince.value = false; // Close dropdown after selection
};

// Function to fetch cities for a given country code
const fetchCities = (countryCode) => {
  cities.value = City.getCitiesOfCountry(countryCode);
  // console.log("Fetched cities:", cities.value);  // Log fetched cities
};

// Function to fetch states for a given country code
const fetchStates = (countryCode) => {
  states.value = State.getStatesOfCountry(countryCode);
  // console.log("Fetched states:", states.value);  // Log fetched states
};

// Watcher for country input change
watch(
  () => paymentDetails.value.country,
  (newCountryName) => {
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === newCountryName.toLowerCase()
    );

    if (country) {
      paymentDetails.value.countryCode = country.isoCode;
      fetchStates(country.isoCode); // Fetch states based on country code
      fetchCities(country.isoCode); // Fetch cities based on country code
    } else {
      paymentDetails.value.countryCode = "";
      states.value = [];
      cities.value = [];
    }
  }
);

// Stripe implementation  Start  
const loadStripe = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => resolve(window.Stripe); // Resolve with the Stripe object
    document.body.appendChild(script);
  });
};

// load stripe initially
onMounted(async () => {
  await loadStripe();
  stripe.value = Stripe(`${STRIPE_PUBLISHED_KEY}`);
});

// function to set payment 
const setPaymentType = async (type) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // set payment type to bank_account
  donationDetails.value.paymentType = type;
  loadingStripe.value = true; // Start loading
  // Collecting form data
  const formData = {
    userInfo: userInfo.value,
    donationDetails: donationDetails.value,
    paymentDetails: paymentDetails.value,
    intentId: {
      paymentIntentId: stripePaymentIntentId.value,
    },
  };

  // Check if the payment type is recurring
  if (type === "recurring") {
    formData.intentId = {};
  } else {
    formData.intentId = {
      paymentIntentId: stripePaymentIntentId.value,
    };
  }

  // console.log("Form Data:", formData); // Log form data for debugging

  if (formData) {
    try {
      // API to fetch payment Intent for stripe
      let response = await fetch(`${API_BASE_URL}${CREATE_STRIPE_PAYMENT_INTENT_ROUTE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching client secret:", errorData);
        return;
      }

      const {
        clientSecret,
        paymentIntentId,
        isRecurring,
        priceId,
        customerId,
      } = await response.json();

      stripePaymentIntentId.value = paymentIntentId;

      const elements = stripe.value.elements({ clientSecret });
      const paymentElement = elements.create("payment");
      paymentElement.mount("#stripe_payment_components");

      // Handle form submission
      const submitButton = document.getElementById("submit-payment-btn");

      submitButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent any default button behavior
        // console.log(isRecurring);
        if (isRecurring == true) {
          // For SetupIntent
          // const { error, setupIntent } = await stripe.value.confirmSetup({
          //   elements, // Ensure 'elements' is defined with your Stripe Elements
          //   confirmParams: {
          //     // No return_url needed with this option
          //   },
          //   redirect: "if_required",
          // });
          // stripe.value.collectBankAccountForPayment({
          //     clientSecret:clientSecret,
          //     params: {
          //       payment_method_type: "us_bank_account",
          //       payment_method_data: {
          //         billing_details: { name: "Jenny Rosen", email: "jenny@example.com" },
          //       },
          //     },
          //   })
          //   .then(function (result) {
          //     // Handle result.error or result.paymentIntent
          //     console.log(result ,result.error);
          //   });
          // console.log(setupIntent);

          const result = await stripe.value.confirmSetup({
            elements, // Ensure 'elements' is defined with your Stripe Elements
            confirmParams: {
              // No return_url needed with this option
            },
            redirect: "if_required", // Allow Stripe to handle redirection if necessary
          });

          if (result) {
            console.error("Setup Error:", result);
            // return;
            const paymentMethodId = setupError.payment_method;

            const response = await fetch(
              `${API_BASE_URL}$/stripe/v1/create-payment-intent`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payment_method_id: paymentMethodId,
                  customer_id: customerId,
                  price_id: priceId,
                }),
              }
            );

            // console.log(response);
          }

          const paymentMethodId = setupError.payment_method;
          // console.log(paymentMethodId);
        } else {
          // Proceed with payment confirmation
          const { error, paymentIntent } = await stripe.value.confirmPayment({
            elements, // Ensure 'elements' is defined with your Stripe Elements
            confirmParams: {
              // No return_url needed with this option
            },
            redirect: "if_required", // Allow Stripe to handle redirection if necessary
          });
        }
        // console.log(paymentIntent);
        if (error) {
          // Display error to your customer
          console.error(error.message);
          alert(error.message);
        } else {
          // Payment successful, redirect or show a success message
          // console.log("Payment successful!");

          // Collecting form data
          const formData = {
            userInfo: userInfo.value,
            stripeResponse: {
              paymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount,
            },
          };

          try {
            // Make the API call for Insert payment resposne

            const response = await fetch(
              `${API_BASE_URL}${CREATE_STRIPE_CREATE_PAYMENT_ROUTE}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json", // Specify the content type
                },
                body: JSON.stringify(formData), // Send form data as JSON
              }
            );
            if (response.ok) {
              apiResponse.value = "Payment successful! Thank you for your donation."; // Success message
            }
          } catch (err) {
            error.value = `${err.message}`; // Set the error message in the UI
          } finally {
            isStripeLoading.value = false; // Stop loading
          }
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      loadingStripe.value = false; // Stop loading
    }
  } else {
    console.log("An error occurred:");
  }
};

// Keep Tracking on changed amount value for bank account payemnt

watch(
  () => donationDetails.value.amount, // Watch the `amount` field
  async (newAmount, oldAmount) => {
    // console.log(`Amount changed from ${oldAmount} to ${newAmount}`);
    if (newAmount !== oldAmount && donationDetails.value.paymentType === "bank_account") {
      // Recreate the payment intent with the updated amount only if the payment type is "bank_account"
      await setPaymentType(donationDetails.value.paymentType); // Re-trigger payment creation
    }
  }
);


// Stripe implementation  End

// Handel from submission 
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

  // console.log("Form Data:", formData); // Log form data for debugging

  // Check the payment type and handle accordingly
  if (donationDetails.value.paymentType === "card") {
    try {
      // Make the API call for card payments
      const response = await fetch(`${API_BASE_URL}${BAMBORA_PAYMENT_ROUTE_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      // console.log("Response:", response); // Log the raw response for debugging

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
      apiResponse.value = "Payment successful! Thank you for your donation."; // Success message
    } catch (err) {
      console.error("API Error:", err.message); // Log the error message for debugging
      error.value = `${err.message}`; // Set the error message in the UI
    } finally {
      isLoading.value = false; // Stop loading indicator
    }
  } else if (donationDetails.value.paymentType === "bank_account") {
    try {
      // console.log(donationDetails.value)
    } catch (err) {
      console.error("Unexpected Error:", err.message);
    }
  } else {
    // Handle other payment types if needed
    // console.log("Other payment type selected:", donationDetails.value.paymentType);
  }

  isLoading.value = false; // Stop loading indicator at the end
};

</script>

<template>
  <div class="backdrop" v-if="true">
    <div class="cd-loading" v-if="isLoading || isStripeLoading">
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
                  <label for="postal_code">Postal code</label>
                  <input
                    class="cd-input-field"
                    v-model="userInfo.postal_code"
                    id="postal_code"
                    type="text"
                    placeholder="Postal code"
                    required
                  />
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
                        @change="handleRecurringChange"
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
                            'cd-toggle-unselected-disabled':
                              payment_recurring_type_value !== 'daily',
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
                          'cd-card-donate-btn-disabled':
                            donationDetails.payment_recurring_type === 'recurring',
                          'cd-card-donate-btn': donationDetails.paymentType === 'paypal',
                          'cd-card-donate-btn-unselected':
                            donationDetails.paymentType !== 'paypal',
                        }"
                        @click="donationDetails.paymentType = 'paypal'"
                        type="button"
                        :disabled="donationDetails.payment_recurring_type === 'recurring'"
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

                      <!-- BANK ACOUNT  -->
                      <!-- on click function is commented due to not implementation of the bank account -->
                      <!-- @click="donationDetails.paymentType = 'bank_account'" -->
                      <!-- :disabled="donationDetails.paymentType !== 'bank_account'" -->

                      <!-- add this when you implemented bank payment  -->
                      <!-- @click="setPaymentType('bank_account')" -->
                      <button
                        :class="{
                          'cd-card-donate-btn-disabled':
                            donationDetails.paymentType !== 'bank_account',
                          'cd-card-donate-btn':
                            donationDetails.paymentType === 'bank_account',
                          'cd-card-donate-btn-unselected':
                            donationDetails.paymentType !== 'bank_account',
                        }"
                       :disabled="donationDetails.paymentType !== 'bank_account'" 
                        type="button"
                      >
                        Bank Account
                      </button>
                    </div>
                  </div>

                  <!-- Group Button End  -->
                  <!-- Credit card template Start  -->
                  <template v-if="donationDetails.paymentType === 'card'">
                    <label for="country">Country</label>

                    <div class="custom-dropdown">
                      <input
                        list="countries"
                        v-model="selectedCountry"
                        id="country"
                        type="text"
                        placeholder="Select or enter a country"
                        required
                        autocomplete="off"
                        class="cd-input-field"
                        @click="openDropdown"
                        @focus="openDropdown"
                        @keydown.enter.prevent="selectCountryName(selectedCountry)"
                      />
                      <div class="dropdown-list" v-if="isOpen">
                        <div
                          class="dropdown-option"
                          v-for="(name, code) in countryList"
                          :key="code"
                          @click="selectCountryName(name)"
                        >
                          {{ name }} ({{ code }})
                        </div>
                      </div>
                    </div>

                    <label for="province">Province</label>

                    <div class="custom-dropdown">
                      <input
                        list="provinces"
                        v-model="paymentDetails.province"
                        id="province"
                        type="text"
                        placeholder="Select or enter a province"
                        required
                        autocomplete="off"
                        class="cd-input-field"
                        @click="openDropdownProvince"
                        @focus="openDropdownProvince"
                      />
                      <div class="dropdown-list" v-if="isProvince">
                        <div
                          class="dropdown-option"
                          v-for="(name, code) in provinceList"
                          :key="code"
                          @click="selectProvinceName(code)"
                        >
                          {{ name }} ({{ code }})
                        </div>
                      </div>
                    </div>

                    <!-- City  -->
                    <label for="city">City</label>
                    <input
                      class="cd-input-field"
                      v-model="paymentDetails.city"
                      placeholder="Enter your city name"
                      id="city"
                      type="text"
                      required
                    />

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
                  <KeepAlive>
                    <template v-if="donationDetails.paymentType === 'bank_account'">
                      <div id="stripe_payment_components"></div>
                      <div v-if="loadingStripe">Loading Stripe components...</div>
                    </template>
                  </KeepAlive>

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
                  v-if="donationDetails.paymentType === 'card'"
                  class="cd-card-donate-btn cd-next-btn cd-absolute-right"
                  type="submit"
                  @click="handleSubmit"
                >
                  Submit
                </button>
                <button
                  v-if="donationDetails.paymentType === 'bank_account'"
                  class="cd-card-donate-btn cd-next-btn cd-absolute-right"
                  type="submit"
                  id="submit-payment-btn"
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
      <div class="donation-modal">
        <div class="donate-box success-box">
          <div class="cd-model-title" v-if="apiResponse">
            <h3>Payment Successful</h3>
          </div>
          <div class="cd-model-title" v-if="error">
            <h3>Payment Unsuccessful</h3>
          </div>
          <div v-if="apiResponse" class="success-content">
            <img
              @load="onGifLoad"
              src="https://new.icandalous.ca/wp-content/uploads/2024/10/success.gif"
              alt="Payment Successful"
              class="success-image"
            />
          </div>
          <div v-if="error" class="success-content">
            <img
              src="https://new.icandalous.ca/wp-content/uploads/2024/10/output-onlinegiftools-1.gif"
              alt="Payment Successful"
              class="success-image"
            />
            <!-- <p v-if="apiResponse" class="success-message">
              {{ apiResponse }}
            </p> -->
            <p v-if="error" class="error-message">{{ error }}</p>
          </div>
          <button class="btn-color" type="submit" @click="$emit('close')">Go back</button>
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
  /* color:  #6C757D;
  border-color:  #6C757D; */
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
  min-height: 60vh;
  padding: 40px;
  border-radius: 10px;
  background-color: #fff;
  min-width: 60%;
  justify-content: center;
  align-items: center;
}

.cd-card-donate-btn-disabled {
  color: #333333;
  align-items: center;
  background-color: #fff;
  box-shadow: none;
  display: flex;
  height: 44px;
  justify-content: center;
  margin-left: 5px;
  overflow: hidden;
  text-align: center;
  width: fit-content;
  padding: 16px 30px;
  margin-bottom: 10px;
  border: 2px solid #6c757d;
  border-radius: 4px;
  cursor: pointer;
}
.custom-dropdown {
  position: relative;
  width: 100%; /* Make dropdown container full width */
}

.cd-input-field {
  width: 100%; /* Input field takes full width */
  padding: 10px;
  border: 2px solid #007c16;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.cd-input-field:focus {
  border-color: #005f12;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-height: 200px; /* Limit the height of the dropdown */
  overflow-y: auto; /* Add scroll if needed */
  z-index: 10;
}

.dropdown-option {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-option:hover,
.dropdown-option.active {
  background-color: #f0f0f0; /* Hover effect */
  color: #007c16; /* Change text color on hover */
}

.success-content {
  margin-top: 20vh;
  padding-top: 10vh;
  padding-bottom: 10vh;
  /* background-color: #f0f0f0;  */
  width: 100%;

  /* background-color: #f0f0f0;  */
  text-align: center;
  margin: 0 auto;
}

.success-image {
  /* height: 0%; */
  width: 50%;
}

.btn-color {
  background-color: #61d485;
  color: #333333;
  align-items: center;
  box-shadow: none;
  display: flex;
  height: 44px;
  justify-content: center;
  margin-left: 5px;
  overflow: hidden;
  text-align: center;
  width: fit-content;
  padding: 16px 30px;
  margin-bottom: 10px;
  border: 2px solid #61d485;
  border-radius: 4px;
  cursor: pointer;
}
</style>
