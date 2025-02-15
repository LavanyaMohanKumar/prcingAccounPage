import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    userProfile: null,
    userKyc: null,
    userSubscription: null,
    billingHistory: null,
    autoPay: null,
  },
  mutations: {
    SET_USER_DATA(state, data) {
      if (data && typeof data === "object") {
        state.userProfile = data.userProfile || {};
        state.userKyc = data.userKyc || {};
        state.userSubscription = data.userSubscription || {};
        state.billingHistory = data.billingHistory || [];
        state.autoPay = data.autoPay || {};
      } else {
        console.warn("SET_USER_DATA received invalid data:", data);
      }
    },
  },
  actions: {
    async fetchUserData({ commit }) {
      try {
        const response = await axios.get(
          "https://staging.primeinvestor.in/wp-admin/admin-ajax.php?action=myPrime"
        );

        console.log("API Response:", response.data); // Debugging

        if (response.data && Object.keys(response.data).length) {
          commit("SET_USER_DATA", response.data);
        } else {
          console.warn("API returned empty user data, loading from local JSON.");
          await fetchLocalUserData(commit);
        }
      } catch (error) {
        console.error("Error fetching user data, loading from local JSON:", error.message);
        await fetchLocalUserData(commit);
      }
    },
  },
  getters: {
    userProfile: (state) => state.userProfile,
    userKyc: (state) => state.userKyc,
    userSubscription: (state) => state.userSubscription,
    billingHistory: (state) => state.billingHistory,
    autoPay: (state) => state.autoPay,
  },
});

// Helper function to fetch local JSON data
async function fetchLocalUserData(commit) {
  try {
    const localResponse = await axios.get("/data/data.json"); // Fetch from public directory

    console.log("Local JSON Response:", localResponse.data); // Debugging

    if (localResponse.data && Object.keys(localResponse.data).length) {
      commit("SET_USER_DATA", localResponse.data);
    } else {
      console.warn("Local JSON file is empty or invalid.");
    }
  } catch (localError) {
    console.error("Error loading local JSON file:", localError.message);
  }
}
