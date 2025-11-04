<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto">

    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
        Profil Toko
      </h1>
    </div>

    <div v-if="shopContextStore.isLoading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-10 w-10 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>

    <div v-if="!shopContextStore.isLoading && shop" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <img :src="shop.cover || 'https://via.placeholder.com/1000x400.png?text=No+Cover'" :alt="shop.name"
            class="w-full h-48 object-cover object-center" />
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ shop.name }}</h2>
              <span
                :class="shop.isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'"
                class="text-sm font-medium px-4 py-1.5 rounded-full flex-shrink-0 ml-4">
                {{ shop.isActive ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </div>

            <div class="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <MapPinIcon class="w-5 h-5 mr-2 flex-shrink-0" />
              <p class="text-lg">{{ shop.fullAddress }}</p>
            </div>

            <div class="mt-6">
              <div class="flex items-center mb-2">
                <InformationCircleIcon class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Deskripsi Toko</h4>
              </div>
              <p class="text-gray-700 dark:text-gray-300 ml-7">
                {{ shop.description || 'Tidak ada deskripsi.' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div v-if="shop.shopImages && shop.shopImages.length > 0"
          class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div class="flex items-center mb-4">
            <PhotoIcon class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Galeri</h4>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(image, index) in shop.shopImages" :key="index" class="cursor-pointer group"
              @click="uiStore.openImageModal({ src: image, title: shop.name })">
              <img :src="image" :alt="`${shop.name} gallery image ${index + 1}`"
                class="w-full h-24 object-cover rounded-md shadow-md group-hover:opacity-75 transition-opacity" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div class="flex items-center mb-4">
            <MapIcon class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Lokasi</h4>
          </div>
          <div class="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <p class="text-gray-500">Tempat untuk Peta</p>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <p>Lat: {{ shop.lat }}</p>
            <p>Lng: {{ shop.lang }}</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useShopContextStore } from '@/features/shop-context/presentation/stores/useShopContextStore';
import { useUiStore } from '@/stores/uiStore';
import { storeToRefs } from 'pinia';

const shopContextStore = useShopContextStore();
const uiStore = useUiStore();

// Ambil state secara reaktif dari store
const { currentShopDetails, isLoading } = storeToRefs(shopContextStore);

// Buat computed property untuk mempermudah akses
const shop = computed(() => currentShopDetails.value);
</script>