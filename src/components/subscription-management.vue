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

    <div v-if="showBillingPopup" class="popup-overlay" @click.self="closePopup">
      <div class="popup-container">
        <div class="popup-header">
          <h2>Choose billing period</h2>
          <button class="close-button" @click="closePopup">✖</button>
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
            :class="{ active: selectedOption === 'monthly' }"
            @click="selectOption('monthly')"
          >
            <label class="option-label">
              <div class="option-content">
                <span>Monthly billing</span>
                <span class="price">₹ 999 per month</span>
              </div>
              <input type="radio" v-model="selectedOption" value="monthly" />
            </label>
          </div>
        </div>

        <div class="button-group">
          <button class="back-button" @click="closePopup">Back</button>
          <button class="proceed-button" :disabled="!selectedOption">
            Proceed
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
import { useStore } from "vuex";
export default {
  data() {
    return {
      isOpen: false,
      showBillingPopup: false,
      showCancelPopup: false,
      showFinalPopup: false,
      selectedOption: null,
      showInitialPopup: false,
      showReasonPopup: false,
      selectedReason: null,
      otherReasonText: null,
      successMessage: null,
    };
  },
  setup() {
    const store = useStore();
    return { store };
  },
  methods: {
    toggleSubscription() {
      this.isOpen = !this.isOpen;
    },
    openBillingPopup() {
      this.showBillingPopup = true;
    },
    autoResize(event) {
      const textarea = event.target;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    },
    closePopup() {
      this.showBillingPopup = false;
      this.showCancelPopup = false;
      this.showFinalPopup = false;
    },
    selectOption(option) {
      this.selectedOption = option;
    },
    confirmCancellation() {
      this.showCancelPopup = false;
      this.showFinalPopup = true;
    },
    openCancelPopup() {
      this.showInitialPopup = true;
    },
    closeInitialPopup() {
      this.showInitialPopup = false;
    },
    showNextPopup() {
      this.showInitialPopup = false;
      this.showReasonPopup = true;
    },
    closeReasonPopup() {
      this.showReasonPopup = false;
    },
    async cancelSubscription() {
      if (!this.selectedReason) {
        alert("Please select a reason for cancellation.");
        return;
      }
      const cancelReason =
        this.selectedReason === "others"
          ? this.otherReasonText
          : this.selectedReason;
      const apiUrl = `${
        process.env.VUE_APP_BASE_URL
      }wp-admin/admin-ajax.php?action=cancelSubscription&cancel_reason=${encodeURIComponent(
        cancelReason
      )}`;
      const response = await fetch(apiUrl, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert(data.data);
        this.closeReasonPopup();
        setTimeout(() => {
          this.store.commit("SET_SUBSCRIPTION_MESSAGE", data.data);
          alert(data.data);
        }, 500);
      } else {
        alert("Error: " + data.data);
      }
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
  background: white;
  border: 1px solid #007bff;
  color: #007bff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}

.proceed-button {
  background: #007bff;
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
