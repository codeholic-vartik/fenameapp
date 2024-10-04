<script setup>
import { ref,onMounted } from "vue";
import Campaign from "@/components/Campaign.vue";
import HomeContact from "@/components/HomeContact.vue";
import data from "@/data/index.json";
import jsonData from "@/data/sadaqa.json";


const props = defineProps({
  
  data: {
    type: Object,
    required: true,
  },
});
const tab1 = props.data.tabs[0].title;
const tab2 = props.data.tabs[1].title;



// Initialize default component to 'Campaign'
const activeComponent = ref(tab1);

// JSON Data for campaigns and contact
const tabData = ref(data);

// Filter and return campaign data
const getCampaignData = () => {
  return tabData.value.find(tab => tab.tabName === tab1 )?.tabItems || [];
};

// Return contact information
const getContactData = () => {
  return tabData.value.find(tab => tab.tabName === tab2)?.tabItems[0] || {};
};

const OpenCapaignOrContact = (e) => {
  const component = e.target.innerText.toLowerCase();
  if (component === tab1 ) {
    activeComponent.value = tab1 ;
  } else if (component === tab2) {
    activeComponent.value = tab2;
  }
};
</script>

<template>
  <div class="cd-container">
    <div class="cd-card-container cd-single-card">
      <div class="cd-custom-card cd-single-card">
        <!-- Campaigns and contact buttons -->
        <div class="cd-campaigns-or-contact">
          <button
            class="cd-selector-btns"
            :class="{ active: activeComponent === tab1  }"
            @click="OpenCapaignOrContact"
          >
            CAMPAIGNS
          </button>
          <button
            class="cd-selector-btns"
            :class="{ active: activeComponent === tab2 }"
            @click="OpenCapaignOrContact"
          >
            CONTACT
          </button>
        </div>

        <!-- Conditional rendering of components with data passed as props -->
        <Campaign
          v-if="activeComponent === tab1 "
          :campaigns="getCampaignData()"
        />
        <HomeContact
          v-if="activeComponent === tab2"
          :contactInfo="getContactData()"
        />
      </div>
    </div>
  </div>
</template>

<style>
.cd-selector-btns {
  padding: 10px;
  border: none;
  background-color: white;
  cursor: pointer;
}

.cd-selector-btns.active {
  background-color: green;
  color: white;
}
</style>
