<template>
  <div class="kyc-card">
    <div class="kyc-header">
      <div class="status-container">
        <strong>KYC Status</strong>
        <el-tag
          :class="kycStatus === 'Verified' ? 'success-tag' : 'pending-tag'"
        >
          {{ kycStatus }}
        </el-tag>
      </div>
      <div v-if="kycStatus === 'Verified'">
        <a href="#" class="toggle-link" @click.prevent="toggleDetails">
          {{ showDetails ? "View less" : "View details" }}
        </a>
      </div>
    </div>

    <div v-if="showDetails && kycStatus === 'Verified'" class="kyc-details">
      <p>
        <strong>{{ userKyc.full_name }}</strong>
      </p>
      <small>{{ userKyc.full_address_parts }}</small>
      <br />
      <small>{{ userKyc.phone }}</small>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const showDetails = ref(false);
    const kycStatus = computed(() =>
      store.state.userKyc?.status ? "Verified" : "Pending"
    );
    const userKyc = computed(() => store.state.userKyc || {});
    const toggleDetails = () => {
      showDetails.value = !showDetails.value;
    };
    return { showDetails, toggleDetails, kycStatus, userKyc };
  },
};
</script>

<style scoped>
.kyc-card {
  border: 1px solid #d1d9e0;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}
.kyc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
}
.pending-tag {
  background-color: #f2f231 !important;
  color: #000;
  border-radius: 5px;
}
.success-tag {
  background-color: #1fd19f !important;
  color: white;
  border-radius: 5px;
}
.status-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.toggle-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}
.kyc-details {
  margin-top: 10px;
  background: #f5f7fa;
  padding: 4px 18px;
  border-radius: 0px 0px 10px 10px;
}
</style>
