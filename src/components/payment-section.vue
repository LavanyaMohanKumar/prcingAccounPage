<template>
  <div class="payment-card">
    <div class="flex justify-between items-center payment-align">
      <span class="text-xl font-semibold">Auto - Debit</span>
      <el-tag :class="isAutoPayEnabled ? 'enabled-tag' : 'disabled-tag'">
        {{ isAutoPayEnabled ? "Enabled" : "Disabled" }}
      </el-tag>
    </div>

    <div class="info-row">
      <span class="text-gray-500">
        You will be intimated 24Hrs prior to debit
      </span>
      <a
        @click="toggleCardDetails"
        class="cursor-pointer text-decoration-none text-black"
      >
        Manage payment
      </a>
    </div>

    <div v-if="showCardDetails" class="flex bg-gray-50 payment-cardAlign">
      <div class="card-row">
        <span class="card-payment">{{ paymentMethod }}</span>
        <div class="card-details">
          <small class="font-medium">Payment Method</small>
          <div class="card-info-row">
            <span class="card-number">{{ maskedPaymentInfo }}</span>
            <button class="change-method-button">Change payment method</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";

export default {
  setup() {
    const autoPay = inject("autoPay");
    const showCardDetails = ref(false);
    const isAutoPayEnabled = computed(() => autoPay.value?.status);
    const paymentMethod = computed(() => {
      if (autoPay.value?.method === "card") {
        return autoPay.value?.network
          ? autoPay.value?.network.toUpperCase()
          : "CARD";
      } else if (autoPay.value?.method === "upi") {
        return "UPI";
      }
      return "N/A";
    });
    const maskedPaymentInfo = computed(() => {
      if (autoPay.value?.method === "upi") {
        return autoPay.value?.upi || "Not Available";
      } else if (autoPay.value?.method === "card") {
        const cardLast4 = autoPay.value?.card || "XXXX";
        return `XXXX XXXX XXXX ${cardLast4}`;
      }
      return "Not Available";
    });
    const toggleCardDetails = () => {
      showCardDetails.value = !showCardDetails.value;
    };
    return {
      showCardDetails,
      toggleCardDetails,
      isAutoPayEnabled,
      paymentMethod,
      maskedPaymentInfo,
    };
  },
};
</script>

<style scoped>
.card-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-details {
  flex-grow: 1;
}

.card-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 450px) {
  .card-info-row {
    font-size: 10px;
  }
}

.card-number {
  color: gray;
}

.change-method-button {
  color: black;
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  margin-left: auto;
}

.payment-card {
  border: 1px solid #d1d9e0;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 10px 20px;
}

@media (max-width: 500px) {
  .info-row {
    font-size: 12px;
  }
}

@media (max-width: 400px) {
  .info-row {
    font-size: 10px;
  }
}

.payment-align {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px 8px 20px;
}

.card-payment {
  background: #ffffff;
  border: 1.2px solid #000000;
  border-radius: 3px;
  margin-top: 2px;
  padding: 1px 8px 2px 8px;
}

.payment-cardAlign {
  padding: 4px 15px 9px 16px;
  background: #f2f2f2;
  font-size: 14px;
  color: #6d4c41;
  border-radius: 0px 0px 12px 12px;
}

.enabled-tag {
  background-color: #1fd19f !important;
  color: white;
}

.disabled-tag {
  background-color: #ff3b3b !important;
  color: white;
}
</style>
