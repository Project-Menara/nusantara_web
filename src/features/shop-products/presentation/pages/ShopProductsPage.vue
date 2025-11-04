<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Produk di Toko
        </h1>
        <p v-if="shopContextStore.currentShopDetails" class="mt-1 text-gray-600 dark:text-gray-400">
          Menampilkan semua produk untuk: <strong>{{ shopContextStore.currentShopDetails.name }}</strong>
        </p>
      </div>
      </div>

    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      
      <div v-if="shopContextStore.isLoading" class="text-center p-10">
        <svg class="animate-spin h-10 w-10 text-violet-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400 mt-4">Memuat data produk...</p>
      </div>

      <div v-else-if="!shopContextStore.isLoading && products.length === 0" class="text-center p-10">
        <ArchiveBoxIcon class="w-12 h-12 text-gray-400 mx-auto" />
        <h2 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Toko Ini Belum Memiliki Produk</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Hubungi Super Admin untuk menambahkan produk ke toko ini.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5">
        
        <div v-for="product in products" :key="product.id"
          class="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700/60 overflow-hidden">
          
          <img 
            class="w-full h-48 object-cover object-center transition-all duration-300"
            :class="{ 'grayscale': !product.isActive }"
            :src="product.coverImage || 'https://via.placeholder.com/400x300.png?text=No+Cover'" 
            :alt="product.name" 
          />
          
          <div class="p-4 flex flex-col flex-grow">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 truncate" :title="product.name">{{ product.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ product.code }}</p>

            <p class="text-lg font-semibold text-gray-900 dark:text-white mt-2">
              {{ formatCurrency(product.price) }}
            </p>

            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60 flex justify-between items-center">
              <div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">STOK</span>
                <p 
                  class="text-lg font-bold"
                  :class="product.stock > 0 ? 'text-gray-800 dark:text-gray-100' : 'text-red-500 dark:text-red-400'"
                >
                  {{ product.stock }} <span class="text-sm font-normal">{{ product.unit }}</span>
                </p>
              </div>
              
              <span 
                :class="product.isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'"
                class="text-xs font-medium px-3 py-1 rounded-full"
              >
                {{ product.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
          </div>
        </div>

      </div>

      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useShopContextStore } from '@/features/shop-context/presentation/stores/useShopContextStore';
import { storeToRefs } from 'pinia';
import { ArchiveBoxIcon } from '@heroicons/vue/24/outline';

const shopContextStore = useShopContextStore();

// Ambil state secara reaktif. Halaman ini HANYA MEMBACA state.
const { currentShopProducts, isLoading } = storeToRefs(shopContextStore);

// Buat computed property untuk mempermudah akses
const products = computed(() => currentShopProducts.value);

// Helper untuk format mata uang
const formatCurrency = (value) => {
  if (value == null) return 'N/A';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};
</script>