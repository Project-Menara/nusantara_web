<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Page Header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
        Management Toko
      </h1>
      <button @click="shopStore.openFormModal()" class="btn bg-violet-500 hover:bg-violet-600 text-white">
        <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
          <path
            d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
        <span class="hidden xs:block ml-2">Tambah Toko</span>
      </button>
    </div>

    <!-- Search Header -->
    <header
      class="bg-white dark:bg-gray-800 shadow-lg rounded-t-lg px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
      <div class="relative">
        <input v-model="localSearchQuery" type="search" class="form-input w-full pl-9"
          placeholder="Cari berdasarkan nama atau alamat toko..." />
        <div class="absolute inset-0 right-auto flex items-center pointer-events-none">
          <svg class="w-4 h-4 fill-current text-gray-400 dark:text-gray-500 ml-3" viewBox="0 0 16 16">
            <path
              d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
            <path
              d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
          </svg>
        </div>
      </div>
    </header>

    <!-- Container untuk Cards dan Pagination -->
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-b-lg">
      <!-- Loading State -->
      <div v-if="isLoading && shops.length === 0" class="text-center p-10">
        <p class="text-gray-500 dark:text-gray-400">Memuat data toko...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && shops.length === 0" class="text-center p-10">
        <p class="text-gray-500 dark:text-gray-400">Belum ada data toko yang ditemukan.</p>
      </div>

      <!-- Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5">
        <div v-for="shop in shops" :key="shop.id"
          class="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700/60">
          <img class="w-full h-48 object-cover object-center transition-all duration-300"
            :class="{ 'grayscale': !shop.isActive }"
            :src="shop.cover || 'https://via.placeholder.com/400x300.png?text=No+Cover'" :alt="shop.name" />

          <div class="p-4 flex flex-col flex-grow">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 truncate" :title="shop.name">{{ shop.name }}
            </h3>
            <p class="text-sm text-gray-500 truncate" :title="shop.fullAddress">{{ shop.fullAddress }}</p>

            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60 flex justify-between items-center">
              <StatusDropdown :item="shop" :isLoading="statusLoadingId === shop.id"
                @toggle="shopStore.toggleShopStatus(shop)" />
              <div class="flex space-x-2">
                
                <button @click="shopStore.openFormModal(shop.id)"
                  class="p-2 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                  title="Edit Toko">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                    <path fill-rule="evenodd"
                      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clip-rule="evenodd"></path>
                  </svg>
                </button>

                <button @click="openDeleteModal(shop.id)"
                  class="p-2 rounded-full bg-red-100 dark:bg-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/40"
                  title="Hapus Toko">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalData > 0" class="p-5 border-t border-gray-100 dark:border-gray-700/60">
        <Pagination :pagination="pagination" :isLoading="isLoading" @change-page="shopStore.changePage" />
      </div>
    </div>

    <!-- Modals -->
    <ShopFormModal />
    <BaseModal :isOpen="isDeleteModalOpen" :loading="isLoading" @close="isDeleteModalOpen = false"
      @confirm="confirmDelete" confirmButtonClass="bg-red-500 hover:bg-red-600 text-white">
      <template #header>
        <DialogTitle as="h3" class="text-lg font-medium text-gray-900 dark:text-gray-100">Hapus Toko</DialogTitle>
      </template>
      <template #body>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus toko <strong>{{ shopToDeleteName }}</strong>?
        </p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useShopStore } from "../stores/useShopStore";
import { storeToRefs } from "pinia";
import Pagination from "@/components/Pagination.vue";
import ShopFormModal from "./components/ShopFormModal.vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import StatusDropdown from "@/components/StatusToggleDropdown.vue";

const shopStore = useShopStore();
const { shops, isLoading, pagination, statusLoadingId } = storeToRefs(shopStore);

const isDeleteModalOpen = ref(false);
const itemToDeleteId = ref(null);

const localSearchQuery = ref("");
let debounceTimer = null;
watch(localSearchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    shopStore.fetchShops(1, newQuery);
  }, 500);
});

const shopToDeleteName = computed(() => {
  if (!itemToDeleteId.value) return '';
  return shops.value.find(s => s.id === itemToDeleteId.value)?.name || '';
});

const openDeleteModal = (id) => {
  itemToDeleteId.value = id;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (itemToDeleteId.value) {
    await shopStore.removeShop(itemToDeleteId.value);
  }
  isDeleteModalOpen.value = false;
};

onMounted(() => {
  shopStore.fetchShops();
});
</script>
