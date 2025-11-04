<template>
  <div v-if="authStore.user?.role === 'admin' && shopContextStore.isContextLoaded" class="flex items-center">

    <div v-if="shopContextStore.isLoading" class="flex items-center px-3">
      <svg class="animate-spin h-5 w-5 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-sm text-gray-500 ml-2 hidden sm:block">Memuat...</span>
    </div>

    <div v-else-if="shopContextStore.availableShops.length === 1" class="flex items-center px-3">
      <BuildingStorefrontIcon class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ shopContextStore.currentShopDetails?.name }}</span>
    </div>

    <Menu v-else-if="shopContextStore.availableShops.length > 1" as="div" class="relative">
      <MenuButton class="hidden lg:flex items-center justify-center text-left px-3 py-2 hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-md">
        <BuildingStorefrontIcon class="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
        <div class="ml-2 min-w-0 flex-1">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Toko Aktif:</p>
          <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
            {{ shopContextStore.currentShopDetails?.name || 'Pilih Toko' }}
          </p>
        </div>
        <ChevronDownIcon class="w-5 h-5 text-gray-400 ml-2 shrink-0" />
      </MenuButton>

      <MenuButton class="lg:hidden w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full">
        <span class="sr-only">Pilih Toko</span>
        <BuildingStorefrontIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </MenuButton>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems class="origin-top-right z-10 absolute top-full right-0 min-w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1">
          <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-4">Pilih Toko</div>
          <ul>
            <MenuItem v-for="shop in shopContextStore.availableShops" :key="shop.id" v-slot="{ active }">
              <li 
                @click="handleShopChange(shop.id)"
                :class="[
                  'block py-2 px-4 cursor-pointer',
                  active ? 'bg-gray-100 dark:bg-gray-700/50' : '',
                  shop.id === shopContextStore.activeShopId ? 'bg-violet-50 dark:bg-violet-900/20' : ''
                ]"
              >
                <div class="flex items-center justify-between">
                  <span 
                    class="text-sm font-medium"
                    :class="shop.id === shopContextStore.activeShopId ? 'text-violet-600 dark:text-violet-300' : 'text-gray-800 dark:text-gray-100'"
                  >
                    {{ shop.name }}
                  </span>
                  <CheckIcon 
                    v-if="shop.id === shopContextStore.activeShopId"
                    class="w-5 h-5 text-violet-500"
                  />
                </div>
              </li>
            </MenuItem>
          </ul>
        </MenuItems>
      </transition>
    </Menu>

  </div>
</template>

<script setup>
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { useShopContextStore } from '@/features/shop-context/presentation/stores/useShopContextStore';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { BuildingStorefrontIcon, ChevronDownIcon, CheckIcon } from '@heroicons/vue/20/solid';

const authStore = useAuthStore();
const shopContextStore = useShopContextStore();

const handleShopChange = (shopId) => {
  // Kita tidak perlu menutup dropdown, Headless UI akan menanganinya
  shopContextStore.selectShop(shopId);
};
</script>