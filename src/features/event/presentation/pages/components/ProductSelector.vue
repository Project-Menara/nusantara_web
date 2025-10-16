<template>
  <div>
    <label class="block text-sm font-medium mb-1">{{ label }}</label>
    <div class="relative">
      <input
        type="search"
        v-model="searchQuery"
        class="form-input w-full"
        placeholder="Cari produk..."
        @click.stop="handleFocus"
      />
      <div
        v-if="isDropdownOpen"
        v-on-click-outside="() => isDropdownOpen = false"
        class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg"
      >
        <div 
          ref="dropdownListRef" 
          @scroll="handleScroll" 
          class="max-h-60 overflow-y-auto"
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
            <li v-if="productStore.isLoadingMore" class="p-2 text-center text-sm text-gray-500">
              Memuat lebih banyak...
            </li>
          </ul>
          <div v-else class="p-2 text-center text-sm text-gray-500">
            Produk tidak ditemukan.
          </div>
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
  label: { type: String, required: true },
});

const emit = defineEmits(['addProduct']);

const productStore = useProductStore();
const searchQuery = ref("");
const isDropdownOpen = ref(false);
const dropdownListRef = ref(null); // Ref untuk elemen yang bisa di-scroll
let debounceTimer = null;

// 1. Memuat data awal saat input di-klik (fokus)
const handleFocus = () => {
  isDropdownOpen.value = true;
  if (productStore.products.length === 0) {
    productStore.searchProducts("");
  }
};

// 2. Mencari saat pengguna mengetik
watch(searchQuery, (newQuery) => {
  isDropdownOpen.value = true;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    productStore.searchProducts(newQuery); // Gunakan aksi baru
  }, 300);
});

// 3. Memuat lebih banyak data saat scroll ke bawah
const handleScroll = () => {
  const el = dropdownListRef.value;
  if (el) {
    // Cek jika scroll sudah mendekati bagian bawah (buffer 5px)
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
    if (isAtBottom) {
      productStore.loadMoreProducts(); // Panggil aksi baru
    }
  }
};

const selectProduct = (product) => {
  emit('addProduct', product);
  isDropdownOpen.value = false;
};
</script>