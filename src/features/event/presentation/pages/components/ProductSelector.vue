<template>
  <div>
    <label class="block text-sm font-medium mb-1">{{ label }}</label>
    <div class="relative">
      <input
        type="search"
        v-model="searchQuery"
        class="form-input w-full"
        placeholder="Cari produk..."
        @focus="isDropdownOpen = true"
      />
      <div
        v-if="isDropdownOpen"
        v-on-click-outside="() => isDropdownOpen = false"
        class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
      >
        <div v-if="productStore.isLoading" class="p-2 text-center text-sm text-gray-500">
          Mencari...
        </div>
        <ul v-else-if="productStore.productList.length > 0">
          <li
            v-for="product in productStore.productList"
            :key="product.id"
            @click="selectProduct(product)"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
          >
            <img :src="product.coverImage" class="h-8 w-8 object-cover rounded mr-2" />
            <span class="text-sm font-medium">{{ product.name }}</span>
          </li>
        </ul>
        <div v-else class="p-2 text-center text-sm text-gray-500">
          Produk tidak ditemukan.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useProductStore } from "@/features/product/presentation/stores/useProductStore";
import { vOnClickOutside } from '@vueuse/components';

defineProps({
  label: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['addProduct']);

const productStore = useProductStore();
const searchQuery = ref("");
const isDropdownOpen = ref(false);
let debounceTimer = null;

// ✅ FUNGSI BARU: Panggil fetch saat input difokuskan
const handleFocus = () => {
  isDropdownOpen.value = true;
  // Jika daftar produk kosong, panggil fetch untuk menampilkan data awal
  if (productStore.productList.length === 0) {
    productStore.fetchProducts(1, ""); 
  }
};

watch(searchQuery, (newQuery) => {
  // Pastikan dropdown terbuka saat mulai mengetik
  isDropdownOpen.value = true; 
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    productStore.fetchProducts(1, newQuery);
  }, 300);
});

const selectProduct = (product) => {
  emit('addProduct', product);
  searchQuery.value = "";
  isDropdownOpen.value = false;
};

</script>