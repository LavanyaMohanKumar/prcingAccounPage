<template>
  <div class="subscription-container">
    <div class="text-center">
      <button @click="toggleSubscription" class="toggle-button">
        Manage subscription
        <span class="arrow">{{ isOpen ? "▲" : "▼" }}</span>
      </button>
    </div>

    <div v-if="isOpen" class="subscription-details">
      <p class="title">What would you like to do today</p>
      <ul class="ml-auto">
        <li class="link-contact-font">
          <a href="#" class="link" @click="openBillingPopup"
            >Change my billing period</a
          >
        </li>
        <li class="link-contact-font">
          <a href="#" class="link" @click="openCancelPopup"
            >Cancel my subscription</a
          >
        </li>
        <li class="link-contact-font">
          Did not find what you are looking for?
          <a href="#" class="link-contact">contact us</a>
        </li>
      </ul>
    </div>

    <div
      v-if="showBillingPopup"
      class="popup-overlay"
      @closePopup="showBillingPopup = false"
    >
      <div class="popup-container">
        <div class="popup-header">
          <h3>Choose billing period</h3>
        </div>

        <div class="billing-options">
          <div
            class="billing-option"
            :class="{ active: selectedOption === 'quarterly' }"
            @click="selectOption('quarterly')"
          >
            <label class="option-label">
              <div class="option-content">
                <span>Quarterly billing</span>
                <span class="price">₹ 1,999 per quarter</span>
              </div>
              <input type="radio" v-model="selectedOption" value="quarterly" />
            </label>
          </div>

          <div
            class="billing-option"
            :class="{ active: selectedOption === 'annually' }"
            @click="selectOption('annually')"
          >
            <label class="option-label">
              <div class="option-content">
                <span>annually billing</span>
                <span class="price">₹ 999 per month</span>
              </div>
              <input type="radio" v-model="selectedOption" value="annually" />
            </label>
          </div>
        </div>
        <div v-if="successMessage" class="text-success">
          {{ successMessage }}
        </div>
        <div class="button-group">
          <button class="back-button" @click="closePopup">Back</button>

          <button
            class="proceed-button"
            :disabled="!isOptionChanged"
            @click="switchBillingCycle"
          >
            Switch
          </button>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showInitialPopup"
      width="300"
      center
      class="custom-close-btn"
    >
      <h3 class="popup-title">Are you sure?</h3>
      <p class="text-center">
        You’ll lose access to our platform & all new recommendations after 25
        Apr
      </p>
      <div class="popup-buttons">
        <button class="btn-no" @click="closeInitialPopup">No</button>
        <button class="btn-yes" @click="showNextPopup">Yes</button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="showReasonPopup"
      width="350"
      center
      class="custom-close-btn"
    >
      <div class="popup-cancel-subscription">
        <h4>We're sorry to see you go</h4>
        <p style="color: #00a3d9">Please give us your 10-second feedback</p>
        <div class="reason-options">
          <p class="question">
            What is the primary reason for canceling your subscription?
          </p>
          <label>
            <input
              type="radio"
              v-model="selectedReason"
              value="I don't find it useful"
            />
            I don't find it useful
          </label>
          <label>
            <input
              type="radio"
              v-model="selectedReason"
              value="I don't find time to use it"
            />
            I don't find time to use it
          </label>
          <label>
            <input
              type="radio"
              v-model="selectedReason"
              value="I find it expensive"
            />
            I find it expensive
          </label>
          <label>
            <input
              type="radio"
              v-model="selectedReason"
              value="I don't invest"
            />
            I don't invest
          </label>
          <label>
            <input type="radio" v-model="selectedReason" value="others" />
            Other reasons
          </label>

          <textarea
            v-if="selectedReason === 'others'"
            v-model="otherReasonText"
            class="other-reason-input"
            placeholder="Is there any other feature that will make offering more valuable for you? kindly let us know"
          ></textarea>
        </div>

        <div class="cancel-popup mt-3">
          <button @click="cancelSubscription" class="btn btn-custom text-white">
            Cancel Subscription
          </button>
        </div>

        <div class="cancel-popup">
          <a class="back-link" @click="closeReasonPopup">
            back to my account page
          </a>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { inject, ref, watch, onMounted, computed } from "vue";
import { useStore } from "vuex";
export default {
  setup(props, { emit }) {
    const userSubscription = inject("userSubscription");
    const successMessage = ref("");
    const showBillingPopup = ref(false);
    const selectedReason = ref(null);
    const showReasonPopup = ref(false);
    const showInitialPopup = ref(false);

    const showNextPopup = () => {
      showInitialPopup.value = false;
      showReasonPopup.value = true;
    };

    const closeReasonPopup = () => {
      showReasonPopup.value = false;
    };

    const openCancelPopup = () => {
      showInitialPopup.value = true;
    };

    const closeInitialPopup = () => {
      showInitialPopup.value = false;
    };

    const otherReasonText = ref("");
    const store = useStore();
    const billingVariations = {
      quarterly: process.env.VUE_APP_SUBSCRIPTION_QUARTERLY,
      annually: process.env.VUE_APP_SUBSCRIPTION_ANNUALLY,
    };
    const selectedOption = ref(null);
    const currentBillingOption = ref(null);
    const setInitialOption = () => {
      const currentBillingId =
        userSubscription?.value?.userCurrentbillingMethod;
      if (currentBillingId === billingVariations.quarterly) {
        selectedOption.value = "quarterly";
        currentBillingOption.value = "quarterly";
      } else if (currentBillingId === billingVariations.annually) {
        selectedOption.value = "annually";
        currentBillingOption.value = "annually";
      }
    };
    const closePopup = () => {
      showBillingPopup.value = false;
      emit("closePopup");
    };

    const openBillingPopup = () => {
      showBillingPopup.value = true;
      successMessage.value = "";
    };
    watch(
      () => props.showBillingPopup,
      (newVal) => {
        if (newVal) {
          setInitialOption();
        }
      }
    );

    onMounted(() => {
      setInitialOption();
    });

    const isOptionChanged = computed(
      () => selectedOption.value !== currentBillingOption.value
    );

    const selectOption = (option) => {
      selectedOption.value = option;
    };

    const cancelSubscription = async () => {
      if (!selectedReason.value) {
        alert("Please select a reason for cancellation.");
        return;
      }
      const cancelReason =
        selectedReason.value === "others"
          ? otherReasonText.value
          : selectedReason.value;
      const apiUrl = `${
        process.env.VUE_APP_BASE_URL
      }/wp-admin/admin-ajax.php?action=cancelSubscription&cancel_reason=${encodeURIComponent(
        cancelReason
      )}`;
      try {
        const response = await fetch(apiUrl, { method: "POST" });
        const data = await response.json();
        if (data.success) {
          setTimeout(() => {
            store.commit("SET_SUBSCRIPTION_MESSAGE", data.data);
            showReasonPopup.value = false;
          }, 300);
        } else {
          alert("Error: " + data.data);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    const switchBillingCycle = async () => {
      if (!isOptionChanged.value) return;
      const newVariationId = billingVariations[selectedOption.value];
      const apiUrl = `${process.env.VUE_APP_BASE_URL}/wp-admin/admin-ajax.php?action=prime_switch_billing_cycle&new_variation_id=${newVariationId}`;
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
          successMessage.value = data.message;
          store.dispatch("fetchUserData");
          setTimeout(() => {
            closePopup();
            setInitialOption();
          }, 2000);
        } else {
          alert(data.data.message);
          closePopup();
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    };

    return {
      emit,
      userSubscription,
      switchBillingCycle,
      selectOption,
      selectedOption,
      selectedReason,
      isOptionChanged,
      successMessage,
      closePopup,
      showBillingPopup,
      otherReasonText,
      openBillingPopup,
      cancelSubscription,
      showNextPopup,
      closeReasonPopup,
      showInitialPopup,
      openCancelPopup,
      closeInitialPopup,
      showReasonPopup,
    };
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleSubscription() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped>
.toggle-button {
  background: none;
  border: none;
  color: black;
  font-size: 16px;
  cursor: pointer;
}

.arrow {
  margin-left: 5px;
  font-size: 14px;
}

.subscription-details {
  padding: 15px;
  margin-top: 10px;
  background-color: #f9f9f9;
  border: 1px solid #d1d9e0;
  border-radius: 12px;
}

.title {
  font-weight: bold;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

.link {
  color: grey;
  text-decoration: underline;
  cursor: pointer;
}

.link-contact {
  color: #00a3d9;
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 420px) {
  .link-contact-font {
    font-size: 12px;
  }
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  font-size: 20px;
  color: black;
  background: transparent;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  color: black;
  background: none;
  cursor: pointer;
}

.billing-options {
  margin-bottom: 20px;
}

.billing-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #d1d9e0;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
}

.billing-option.active {
  border: 2px solid #007bff;
}

.option-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.option-content {
  display: flex;
  flex-direction: column;
}

.price {
  color: grey;
  font-size: 14px;
}

input[type="radio"] {
  cursor: pointer;
  accent-color: #007bff;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 13px;
}

.back-button {
  background: transparent;
  border: 1px solid black;
  color: black;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}

.proceed-button {
  background: #00a3d9;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}

.proceed-button:disabled {
  background: #d3d3d3;
  cursor: not-allowed;
}

.popup-title {
  text-align: center;
  margin-bottom: 10px;
}

.reason-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
  background: #f2f2f2;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 14px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
}

.cancel-popup {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.btn-no,
.btn-yes {
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
}

.btn-no {
  background-color: #012e40;
  color: white;
}

.btn-yes {
  color: black;
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25), 0px 0px 4px rgba(0, 0, 0, 0.25);
}

.other-reason-input {
  width: 100%;
  min-height: 80px;
  margin-top: 10px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  resize: none;
  overflow-y: hidden;
  overflow-x: hidden;
}

.btn-custom {
  border-color: #dd2e44 !important;
  color: #dd2e44 !important;
}

::v-deep(.custom-close-btn .el-dialog__headerbtn) {
  background-color: transparent;
}

::v-deep(.custom-close-btn .el-dialog__headerbtn:hover) {
  background-color: transparent;
}
</style>
