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
            </div>

            <div v-else-if="!shopContextStore.isLoading && products.length === 0" class="text-center p-10">
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5">

                <div v-for="product in products" :key="product.id"
                    class="bg-white dark:bg-gray-800/50 rounded-lg shadow-lg flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700/60 overflow-hidden">

                    <div class="relative">
                        <img class="w-full h-48 object-cover object-center transition-all duration-300"
                            :class="{ 'grayscale': !product.isActive }"
                            :src="product.coverImage || 'https://via.placeholder.com/400x300.png?text=No+Cover'"
                            :alt="product.name" />
                        <span class="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-md"
                            :class="product.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-500/30 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-500/30 dark:text-red-300'">
                            {{ product.isActive ? 'Aktif' : 'Nonaktif' }}
                        </span>
                    </div>

                    <div class="p-4 flex flex-col flex-grow">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ product.code }}</p>
                            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 truncate"
                                :title="product.name">{{ product.name }}</h3>
                        </div>

                        <p class="text-xl font-extrabold text-violet-600 dark:text-violet-400 mt-2">
                            {{ formatCurrency(product.price) }}
                        </p>

                        <div class="flex-grow"></div>

                        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center text-gray-500 dark:text-gray-400">
                                    <ArchiveBoxIcon class="w-4 h-4 mr-2" />
                                    <span class="text-xs font-medium uppercase">Stok</span>
                                </div>
                                <p class="text-base font-bold"
                                    :class="product.stock > 0 ? 'text-gray-800 dark:text-gray-100' : 'text-red-500 dark:text-red-400'">
                                    {{ product.stock }} <span class="text-sm font-normal">{{ product.unit }}</span>
                                </p>
                            </div>
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