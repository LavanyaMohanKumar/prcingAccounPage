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
      <p v-if="subscriptionMessage">{{ subscriptionMessage }}</p>
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
      <p v-if="subscriptionMessage">{{ subscriptionMessage }}</p>
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
      <p v-if="subscriptionMessage">{{ subscriptionMessage }}</p>
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
      <p v-if="subscriptionMessage">{{ subscriptionMessage }}</p>
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
      <p v-if="subscriptionMessage">{{ subscriptionMessage }}</p>
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
      <p v-if="subscriptionMessage">{{ subscriptionMessage }}</p>
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
    <div class="subscription-footer" v-if="subscriptionData.userType === 6">
      <p v-if="subscriptionMessage">{{ subscriptionMessage }}</p>
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
      <b-button
        @click="openLink"
        class="plan-button"
        v-if="subscriptionData.buttonText"
      >
        {{ subscriptionData.buttonText }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useStore } from "vuex";

export default {
  name: "SubscriptionCard",
  setup() {
    const userSubscription = inject("userSubscription");
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
    return {
      subscriptionData,
      openLink,
      subscriptionMessage,
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
</style>
