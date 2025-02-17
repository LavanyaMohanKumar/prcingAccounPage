<template>
  <div class="card p-3">
    <strong class="mb-3">Billing History</strong>
    <div class="table-wrapper">
      <b-table
        :items="products"
        :fields="fields"
        bordered
        hover
        responsive="sm"
        class="custom-table"
      >
        <template #cell(id)="data">
          <a :href="data.item.id.url" target="_blank" class="order-link">
            {{ data.item.id.number }}
          </a>
        </template>
      </b-table>
    </div>

    <div class="d-flex justify-content-center mt-1">
      <a v-if="!showAll" @click="viewMore"> View More </a>
      <a v-else @click="viewLess"> View Less </a>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject, watch } from "vue";

export default {
  setup() {
    const BASE_URL = process.env.VUE_APP_BASE_URL;
    const fields = [
      { key: "id", label: "Order ID" },
      { key: "Date", label: "Date" },
      { key: "Description", label: "Description" },
      { key: "Amount", label: "Amount" },
    ];
    const billingHistory = inject("billingHistory");
    const allProducts = computed(() => {
      if (!billingHistory.value) return [];
      return Object.values(billingHistory.value).map((item) => {
        const match = item.id.match(/\/view-order\/(\d+)\/?/);
        const orderNumber = match ? match[1] : "Unknown";
        const orderUrl = `${BASE_URL}/my-account/view-order/${orderNumber}`;
        return {
          id: { number: orderNumber, url: orderUrl },
          Date: item.orderDate,
          Description: item.orderitem,
          Amount: item.orderTotal.replace(/<\/?[^>]+(>|$)/g, ""),
        };
      });
    });
    const products = ref([]);
    const showAll = ref(false);
    const updateProducts = () => {
      products.value = allProducts.value.slice(0, 2);
    };
    watch(allProducts, (newProducts) => {
      products.value = newProducts.slice(0, 3);
    });
    const viewMore = () => {
      products.value = allProducts.value;
      showAll.value = true;
    };
    const viewLess = () => {
      updateProducts();
      showAll.value = false;
    };
    return { products, fields, showAll, viewMore, viewLess };
  },
};
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
  overflow-x: auto;
}

.custom-table {
  min-width: 700px;
}
</style>
