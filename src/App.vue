<template>
  <div id="app">
    <b-row class="justify-content-center" v-if="loading">
      <b-spinner label="Loading..." variant="primary" class="my-4"></b-spinner>
    </b-row>
    <b-container v-else fluid>
      <h3>My Account</h3>
      <b-row class="mb-3">
        <b-col cols="12" md="8" lg="6">
          <profileName />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="12" md="8" lg="6">
          <kycVerification />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="12" md="8" lg="6">
          <SubscriptionCard />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="12" md="8" lg="6">
          <bookingHistory />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="12" md="8" lg="6">
          <paymentSection />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="12" md="8" lg="6">
          <subscriptionManagement />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { computed, provide } from "vue";

import profileName from "./components/my-profile.vue";
import kycVerification from "./components/kyc-verification.vue";
import bookingHistory from "./components/booking-history.vue";
import SubscriptionCard from "./components/subscription-plan.vue";
import paymentSection from "./components/payment-section.vue";
import subscriptionManagement from "./components/subscription-management.vue";

export default {
  components: {
    profileName,
    kycVerification,
    bookingHistory,
    SubscriptionCard,
    paymentSection,
    subscriptionManagement,
  },
  setup() {
    const store = useStore();
    const loading = ref(true);
    onMounted(async () => {
      try {
        await store.dispatch("fetchUserData");
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        loading.value = false;
      }
    });
    const userProfile = computed(() => store.getters.userProfile);
    const userKyc = computed(() => store.getters.userKyc);
    const userSubscription = computed(() => store.getters.userSubscription);
    const billingHistory = computed(() => store.getters.billingHistory);
    const autoPay = computed(() => store.getters.autoPay);

    provide("userProfile", userProfile);
    provide("userKyc", userKyc);
    provide("userSubscription", userSubscription);
    provide("billingHistory", billingHistory);
    provide("autoPay", autoPay);

    return { loading };
  },
};
</script>

<style scoped>
#app {
  background: linear-gradient(180deg, #e3fdff 0%, #ffffff 100%) !important;
  padding: 25px;
}
</style>
