<template>
  <div class="subscription-card">
    <div class="subscription-header">
      <h3>Subscription</h3>
      <div class="status-row">
        <span>Status</span>
        <span
          :class="{
            'green-bg':
              subscriptionData.status === 'Active' ||
              subscriptionData.status === 'Trial Active',
            'red-bg':
              subscriptionData.status === 'Expired' ||
              subscriptionData.status === 'Expired Trial',
            'blue-bg': subscriptionData.status === 'Active Trial',
          }"
        >
          {{ subscriptionData.status }}
        </span>
      </div>
    </div>
    <div class="subscription-footer" v-if="subscriptionData.userType === 0">
      <p
        v-if="subscriptionData.planInfo"
        class="fw-bold"
        :style="{ color: subscriptionData.buttonText ? '#dd2e44' : '#000' }"
      >
        {{ subscriptionData.planInfo }}
      </p>
      <p v-if="subscriptionData.textlabelone">
        {{ subscriptionData.textlabelone }}
      </p>
      <p v-if="subscriptionData.textlabeltwo">
        {{ subscriptionData.textlabeltwo }}
      </p>

      <b-button
        @click="openLink"
        class="plan-button"
        v-if="subscriptionData.buttonText"
      >
        {{ subscriptionData.buttonText }}
      </b-button>

      <div v-if="subscriptionData.familyPan">
        <hr />
        <p>
          <span style="color: #1fd19f">Bonus :</span>
          {{ subscriptionData.familyPan }}
        </p>
      </div>
    </div>
    <div
      class="subscription-footer"
      v-else-if="subscriptionData.userType === 1"
    >
      <p
        v-if="subscriptionData.planInfo"
        class="fw-bold"
        style="color: #dd2e44"
      >
        {{ subscriptionData.planInfo }}
      </p>
      <p v-if="subscriptionData.textlabelone">
        {{ subscriptionData.textlabelone }}
      </p>
      <p v-if="subscriptionData.textlabeltwo">
        {{ subscriptionData.textlabeltwo }}
      </p>

      <b-button
        @click="openLink"
        class="plan-button"
        v-if="subscriptionData.buttonText"
      >
        {{ subscriptionData.buttonText }}
      </b-button>

      <div v-if="subscriptionData.familyPan">
        <hr />
        <p>
          <span style="color: #1fd19f">Bonus :</span>
          {{ subscriptionData.familyPan }}
        </p>
      </div>
    </div>
    <div class="subscription-footer" v-if="subscriptionData.userType === 2">
      <p v-if="subscriptionData.planInfo" class="fw-bold">
        {{ subscriptionData.planInfo }}
      </p>
      <p v-if="subscriptionData.textlabelone">
        {{ subscriptionData.textlabelone }}
      </p>
      <p v-if="subscriptionData.textlabeltwo">
        {{ subscriptionData.textlabeltwo }}
      </p>
      <b-button
        @click="openLink"
        class="plan-button"
        v-if="subscriptionData.buttonText"
      >
        {{ subscriptionData.buttonText }}
      </b-button>
    </div>
    <div class="subscription-footer" v-if="subscriptionData.userType === 3">
      <p v-if="subscriptionData.planInfo" class="fw-bold">
        {{ subscriptionData.planInfo }}
      </p>
      <p v-if="subscriptionData.textlabelone">
        {{ subscriptionData.textlabelone }}
      </p>
      <p v-if="subscriptionData.textlabeltwo">
        {{ subscriptionData.textlabeltwo }}
      </p>
      <b-button
        @click="openLink"
        class="plan-button"
        v-if="subscriptionData.buttonText"
      >
        {{ subscriptionData.buttonText }}
      </b-button>
    </div>
    <div class="subscription-footer" v-if="subscriptionData.userType === 4">
      <p v-if="subscriptionData.planInfo">
        <img
          src="@/assets/images/creditcard.svg"
          alt="creditcard"
          class="icon"
        />
        {{ subscriptionData.planInfo }}
      </p>
      <p v-if="subscriptionData.nextPay">
        <img src="@/assets/images/calendar.svg" alt="calender" class="icon" />
        {{ subscriptionData.nextPay }}
      </p>
    </div>
    <div class="subscription-footer" v-if="subscriptionData.userType === 5">
      <p v-if="subscriptionMessage" class="red-text">
        {{ subscriptionMessage }}
      </p>
      <p v-if="subscriptionData.cancelSub" class="red-text">
        {{ subscriptionData.cancelSub }}
      </p>
      <p v-if="subscriptionData.planInfo">
        <img
          src="@/assets/images/creditcard.svg"
          alt="creditcard"
          class="icon"
        />
        {{ subscriptionData.planInfo }}
      </p>
      <p
        v-if="
          !subscriptionMessage &&
          !subscriptionData.cancelSub &&
          subscriptionData.nextPay
        "
      >
        <img src="@/assets/images/calendar.svg" alt="calender" class="icon" />
        {{ subscriptionData.nextPay }}
      </p>
      <p v-if="nextPaymentDate">
        <img src="@/assets/images/calendar.svg" alt="calendar" class="icon" />
        {{ nextPaymentDate }}
      </p>
      <b-button
        @click="resumeSubscription"
        class="plan-button"
        v-if="subscriptionMessage"
      >
        Activate auto-debit
      </b-button>
      <b-button
        @click="
          subscriptionData.buttonText === 'Activate auto-debit'
            ? resumeSubscription()
            : openLink()
        "
        class="plan-button"
        v-if="subscriptionData.buttonText"
      >
        {{ subscriptionData.buttonText }}
      </b-button>
    </div>
    <div class="subscription-footer" v-if="subscriptionData.userType === 6">
      <p class="red-text" v-if="subscriptionData.planInfo">
        {{ subscriptionData.planInfo }}
      </p>
      <p v-if="subscriptionData.textlabelone">
        <img
          src="@/assets/images/creditcard.svg"
          alt="creditcard"
          class="icon"
        />
        {{ subscriptionData.textlabelone }}
      </p>
      <p v-if="promoMessage">
        <img src="@/assets/images/percent.svg" alt="percent" class="icon" />
        {{ promoMessage }}
      </p>
      <div>
        <b-button
          class="plan-button"
          v-if="buttonText"
          @click="handleSubscriptionRenewal"
        >
          {{ buttonText }}
        </b-button>

        <b-button
          class="plan-button"
          v-if="subscriptionData.buttonText && !buttonText"
          @click="handleSubscriptionRenewal"
        >
          {{ subscriptionData.buttonText }}
        </b-button>
      </div>
      <div class="text-center">
        <div v-if="showCouponInput && !couponApplied" class="mt-2 d-flex gap-2">
          <input
            type="text"
            v-model="couponCode"
            placeholder="Enter coupon code"
            class="form-control"
            style="width: 70%"
          />
          <button @click="applyCoupon" class="btn button-color">Apply</button>
        </div>
        <p v-if="errorMessage" class="mt-2 text-danger">{{ errorMessage }}</p>
        <small
          v-if="!couponApplied"
          @click="showCouponInput = true"
          class="mt-4"
        >
          Have a coupon code?
          <span
            class="text-decoration-underline cursor-pointer"
            style="color: #00a3d9"
            >Apply coupon</span
          >
        </small>

        <small v-else @click="removeCoupon" class="mt-3">
          <span
            class="text-decoration-underline cursor-pointer"
            style="color: #00a3d9"
            >Remove coupon</span
          >
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "SubscriptionCard",
  setup() {
    const userSubscription = inject("userSubscription");
    const couponCode = ref("");
    const showCouponInput = ref(false);
    const promoMessage = ref("");
    const buttonText = ref("");
    const errorMessage = ref("");
    const couponApplied = ref(false);
    const savedCouponCode = ref(null);
    const nextPaymentDate = computed(() => store.state.nextPaymentDate);
    const toggleCoupon = () => {
      showCouponInput.value = !showCouponInput.value;
    };
    const removeCoupon = () => {
      couponApplied.value = false;
      couponCode.value = "";
      promoMessage.value = "";
      buttonText.value = "";
    };

    const handleSubscriptionRenewal = async () => {
      try {
        let apiUrl = `${process.env.VUE_APP_BASE_URL}/wp-admin/admin-ajax.php?action=resumePaySubscription`;
        if (savedCouponCode.value) {
          apiUrl += `&coupon_code=${savedCouponCode.value}`;
        }

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          openRazorpayPopup(data.data);
        } else {
          promoMessage.value = data.data.message;
        }
      } catch (error) {
        console.error("Error renewing subscription:", error);
        promoMessage.value = "An unexpected error occurred.";
      }
    };
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        if (typeof Razorpay !== "undefined") {
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject("Razorpay script failed to load");
          document.body.appendChild(script);
        }
      });
    };
    const openRazorpayPopup = async (orderData) => {
      try {
        await loadRazorpayScript();
        const options = {
          key: orderData.razorpay_order_key,
          order_id: orderData.razorpay_order_id,
          customer_id: orderData.razorpay_customer_id,
          recurring: "1",
          handler: function () {
            store.dispatch("fetchUserData");
          },
          notes: {
            "note_key 1": "Resubcription order",
          },
        };
        var razorpay = new Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Error loading Razorpay script:", error);
      }
    };
    const applyCoupon = async () => {
      if (!couponCode.value) {
        errorMessage.value = "Please enter a coupon code.";
        return;
      }
      try {
        const apiUrl = `${process.env.VUE_APP_BASE_URL}/wp-admin/admin-ajax.php?action=check_subscription_coupon&coupon_code=${couponCode.value}`;

        const response = await fetch(apiUrl, {
          method: "POST",
        });

        const data = await response.json();

        if (data.success) {
          savedCouponCode.value = couponCode.value;
          promoMessage.value = data.data.promoInfo;
          buttonText.value = data.data.buttonText;
          couponApplied.value = true;
          showCouponInput.value = false;
        } else {
          errorMessage.value = data.data.message;
        }
      } catch (error) {
        console.error("Error applying coupon:", error);
        errorMessage.value = "An unexpected error occurred.";
      }
    };
    const subscriptionData = computed(() => userSubscription.value || {});

    const openLink = () => {
      if (subscriptionData.value.buttonUrl) {
        window.open(subscriptionData.value.buttonUrl, "_blank");
      } else {
        console.warn("No URL found in subscriptionData.buttonUrl");
      }
    };
    const store = useStore();
    const subscriptionMessage = computed(
      () => store.getters.subscriptionMessage
    );
    const resumeSubscription = async () => {
      try {
        const apiUrl = `${process.env.VUE_APP_BASE_URL}/wp-admin/admin-ajax.php?action=resumeSubscription`;
        const response = await fetch(apiUrl, {
          method: "POST",
        });
        const data = await response.json();
        if (data.success) {
          store.commit("setNextPaymentDate", data.data);
          store.commit("setSubscriptionMessage", null);
          subscriptionData.value.buttonText = null;
          store.dispatch("fetchUserData");
        } else {
          alert("Error: " + data.data);
        }
      } catch (error) {
        alert("An unexpected error occurred.");
      }
    };
    return {
      subscriptionData,
      openLink,
      subscriptionMessage,
      resumeSubscription,
      showCouponInput,
      couponCode,
      toggleCoupon,
      promoMessage,
      buttonText,
      errorMessage,
      nextPaymentDate,
      applyCoupon,
      couponApplied,
      removeCoupon,
      savedCouponCode,
      handleSubscriptionRenewal,
      openRazorpayPopup,
    };
  },
};
</script>

<style scoped>
.red-text {
  color: #dd2e44;
}

.icon {
  width: 24px;
  height: 24px;
  margin-bottom: 5px;
}

.plan-button {
  color: #00a3d9 !important;
  background: transparent;
  border: 1px solid #00a3d9;
  width: 100%;
}

.green-bg {
  background-color: #1fd19f;
  color: #fff;
  padding: 3px 3px;
  gap: 4px;
  border-radius: 4px;
}

.red-bg {
  background-color: #dd2e44;
  color: #fff;
  padding: 2px 3px;
  gap: 4px;
  border-radius: 4px;
}

.blue-bg {
  border: 1px solid #012e40;
  color: #012e40;
  padding: 2px 3px;
  gap: 4px;
  border-radius: 4px;
}

.plan-button:hover {
  background: transparent;
  border: 1px solid #00a3d9;
}
.subscription-card {
  border: 1px solid #d1d9e0;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
}

.subscription-header {
  padding: 16px;
}

.subscription-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #0f0f0f;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-badge {
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
}

.status-badge.active {
  background-color: #1fd19f;
}
.status-badge.expired {
  background-color: #f44336;
}
.status-badge.pending {
  background-color: #f2f231;
  color: #000;
}

.subscription-footer {
  background-color: #f2f2f2;
  padding: 12px 16px;
  color: #333;
}

.button-color {
  width: 30%;
  background: #00a3d9;
  color: white;
}
</style>
