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
    <div class="kyc-body" v-if="kycStatus === 'Pending'">
      <p class="mt-2">As per SEBI Regulation Jan 2025.</p>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <small>All research analysts are mandated to store KYC records.</small>
        <b-link
          href="#"
          class="cursor-pointer"
          style="color: #00a3d9"
          @click="showPanPopup = true"
          >Update now</b-link
        >
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
    <el-dialog
      v-model="showPanPopup"
      title="Enter PAN Details"
      width="400px"
      center
    >
      <el-form>
        <el-form-item label="PAN Number" :error="panError">
          <el-input
            v-model="panNumber"
            placeholder="Enter your PAN"
            maxlength="10"
            class="w-100"
            @input="validatePAN"
          />
        </el-form-item>
        <el-form-item
          label="Date of Birth"
          :error="dobError"
          class="flex-grow-1"
        >
          <el-date-picker
            v-model="dob"
            class="w-100 custom-date-picker"
            placeholder="Select Date of Birth"
            type="date"
            @change="validateDOB"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPanPopup = false">Cancel</el-button>
        <el-button type="primary" @click="submitPAN" :disabled="!isFormValid"
          >Submit</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, ref, inject } from "vue";

export default {
  setup() {
    const userKyc = inject("userKyc", {});
    const showPanPopup = ref(false);
    const panNumber = ref("");
    const dob = ref("");
    const showDetails = ref(false);
    const panError = ref("");
    const dobError = ref("");
    const isFormValid = ref(false);
    const validatePAN = () => {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
      if (!panRegex.test(panNumber.value)) {
        panError.value = "Invalid PAN format";
        isFormValid.value = false;
      } else {
        panError.value = "";
        validateForm();
      }
    };

    const validateDOB = () => {
      if (!dob.value) {
        dobError.value = "Date of Birth is required";
        isFormValid.value = false;
      } else {
        dobError.value = "";
        validateForm();
      }
    };

    const validateForm = () => {
      if (
        panError.value === "" &&
        dobError.value === "" &&
        panNumber.value !== "" &&
        dob.value !== ""
      ) {
        isFormValid.value = true;
      } else {
        isFormValid.value = false;
      }
    };

    const submitPAN = async () => {
      if (!isFormValid.value) {
        return;
      }
      const formattedDOB = dob.value
        ? new Date(dob.value).toISOString().split("T")[0]
        : "";
      try {
        const apiUrl = `${process.env.VUE_APP_BASE_URL}/wp-admin/admin-ajax.php?action=verify_kyc_with_pan_callback&pan=${panNumber.value}&cus_dob=${formattedDOB}`;
        const response = await fetch(apiUrl, {
          method: "POST",
        });
        const data = await response.json();
        if (data.success) {
          console.log("KYC Verification Success:", data);
        } else {
          console.error("KYC Verification Failed:", data.message);
        }
      } catch (error) {
        console.error("Error verifying KYC:", error);
      }
    };
    const kycStatus = computed(() =>
      userKyc.value?.status ? "Verified" : "Pending"
    );
    const toggleDetails = () => {
      showDetails.value = !showDetails.value;
    };

    return {
      showDetails,
      toggleDetails,
      kycStatus,
      userKyc,
      showPanPopup,
      panNumber,
      dob,
      panError,
      dobError,
      isFormValid,
      validatePAN,
      validateDOB,
      submitPAN,
    };
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
.kyc-body {
  background: #f2f2f2;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0px 0px 10px 10px;
  padding: 9px 20px;
}

::v-deep(
    .custom-date-picker .el-input__prefix .el-input__prefix-inner .el-icon
  ) {
  margin-left: auto !important; /* Moves it to the right */
  order: 2;
}

::v-deep(.custom-date-picker .el-input__suffix .el-input__suffix-inner) {
  position: absolute;
  right: 10px !important;
  left: auto !important;
  display: flex;
  align-items: center;
}
</style>
