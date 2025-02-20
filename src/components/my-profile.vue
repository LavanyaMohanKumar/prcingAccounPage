<template>
  <b-row class="align-items-center d-flex">
    <div class="profile-wrapper">
      <div class="profile-container">
        <label for="imageUpload" class="upload-label">
          <img
            :src="computedProfileImage"
            alt="Profile Picture"
            class="dashboard-avatar-img"
          />

          <span class="edit-icon">
            <img src="@/assets/images/edit.svg" alt="Edit" />
          </span>

          <input
            type="file"
            id="imageUpload"
            @change="handleFileUpload"
            accept="image/*"
            hidden
          />
        </label>

        <input
          type="file"
          id="imageUpload"
          @change="onImageChange"
          accept="image/*"
          hidden
        />
      </div>

      <div class="user-details">
        <p>
          <strong class="user-details-name">Name : </strong>
          {{ userName }}
        </p>
        <p>
          <strong class="user-details-name">Email : </strong>
          {{ userEmail }}
          &nbsp;
          <span>
            <img src="@/assets/images/reset.svg" style="width: 16px" />
            &nbsp;
            <a href="#" class="edit-link">Reset password</a>
          </span>
        </p>
      </div>
      <el-dialog
        v-model="showNameDialog"
        title="Edit Name"
        width="500px"
        center
      >
        <div>
          <label for="newNameInput"><strong>Name:</strong></label>
          <input
            id="newNameInput"
            v-model="tempName"
            class="name-input"
            type="text"
          />
        </div>
        <template #footer>
          <button class="btn-cancel" @click="closeNameDialog">Cancel</button>
          <button class="btn-save" @click="saveName">Save</button>
        </template>
      </el-dialog>
    </div>
  </b-row>
</template>

<script>
import { ref, computed, inject, watch } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const profileImage = ref(require("@/assets/images/Profile.jpg"));
    const store = useStore();
    const computedProfileImage = computed(() => {
      return userProfile?.userImage || profileImage.value;
    });

    const userProfile = inject("userProfile");
    const userName = computed(() => userProfile.value?.userName || "");
    const userEmail = computed(() => userProfile.value?.userEmail || "");
    const showNameDialog = ref(false);
    const tempName = ref("");
    const onImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        profileImage.value = URL.createObjectURL(file);
      }
    };
    const openNameDialog = () => {
      tempName.value = userName.value;
      showNameDialog.value = true;
    };

    const closeNameDialog = () => {
      showNameDialog.value = false;
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        uploadImage(formData);
      }
    };
    watch(
      () => store.state.userProfile.userImage,
      (newImage) => {
        if (newImage) {
          userProfile.value.userImage = newImage;
        }
      }
    );
    const uploadImage = async (formData) => {
      const baseURL = process.env.VUE_APP_BASE_URL;
      const action = "dashboard_userProfile_image";
      try {
        const response = await fetch(
          `${baseURL}/wp-admin/admin-ajax.php?action=${action}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();
        if (result.success) {
          store.commit("SET_USER_PROFILE_IMAGE", result.data.url);
        } else {
          console.error("Upload failed:", result.data.message);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
    return {
      userProfile,
      userName,
      userEmail,
      profileImage,
      onImageChange,
      showNameDialog,
      tempName,
      openNameDialog,
      closeNameDialog,
      computedProfileImage,
      handleFileUpload,
      uploadImage,
    };
  },
};
</script>

<style scoped>
.user-details-name {
  display: inline;
}

.name-input {
  width: 100%;
  margin-top: 8px;
  padding: 4px;
  box-sizing: border-box;
}

@media screen and (max-width: 530px) {
  .user-details-name {
    display: none;
  }
}

.profile-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 12px;
}

.profile-container {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  flex-shrink: 0;
}

.user-details {
  flex-grow: 1;
  margin-left: 12px;
  min-width: 0;
}

.edit-link {
  color: grey;
  text-decoration: underline;
}

.edit-link:hover {
  text-decoration-color: darkgrey;
}

.dashboard-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid black;
}

.edit-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.edit-icon img {
  width: 12px;
  height: 12px;
}

.btn-cancel,
.btn-save {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 4px;
}

.btn-cancel {
  background-color: #bbb;
  color: #fff;
  border: none;
}

.btn-save {
  background-color: #007bff;
  color: #fff;
  border: none;
}
</style>
