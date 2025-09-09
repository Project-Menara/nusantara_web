<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <!-- Page Header -->
        <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Management Kasir
            </h1>
            <button @click="cashierStore.openFormModal()" class="btn bg-violet-500 hover:bg-violet-600 text-white">
                <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path
                        d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span class="hidden xs:block ml-2">Tambah Kasir</span>
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && cashiers.length === 0" class="text-center py-10">
            <p class="text-gray-500 dark:text-gray-400">Memuat data kasir...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading && cashiers.length === 0" class="text-center py-10">
            <p class="text-gray-500 dark:text-gray-400">Belum ada data kasir yang ditambahkan.</p>
        </div>

        <!-- Cards Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <!-- Card Loop -->
            <div v-for="cashier in cashiers" :key="cashier.id"
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1">
                <div class="relative pt-[100%]">
                    <img :src="cashier.photo || 'https://placehold.co/400x400/e2e8f0/64748b?text=Foto'"
                        :alt="`Foto ${cashier.name}`" class="absolute top-0 left-0 w-full h-full object-cover" />
                </div>
                <div class="p-5 flex flex-col flex-grow text-center">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">{{ cashier.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate">{{ cashier.email }}</p>
                    <div class="mt-auto flex space-x-3">
                        <button @click="cashierStore.openFormModal(cashier.id)"
                            class="btn-sm w-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100">Edit
                            Kasir</button>
                        <button @click="openDeleteModal(cashier.id)"
                            class="btn-sm w-full bg-red-500 hover:bg-red-600 text-white">Hapus</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.totalData > 0" class="mt-8">
            <Pagination :pagination="pagination" :isLoading="isLoading" @change-page="cashierStore.changePage" />
        </div>

        <!-- Modals -->
        <CashierFormModal />
        <BaseModal :isOpen="isDeleteModalOpen" :loading="isLoading" @close="isDeleteModalOpen = false"
            @confirm="confirmDelete">
            <template #header>
                <DialogTitle as="h3" class="text-lg font-medium text-gray-900 dark:text-gray-100">Hapus Kasir
                </DialogTitle>
            </template>
            <template #body>
                <p class="text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin menghapus kasir **{{
                    cashierToDeleteName }}**?</p>
            </template>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCashierStore } from "../stores/useCashierStore";
import { storeToRefs } from "pinia";
import Pagination from "@/components/Pagination.vue";
import CashierFormModal from "./components/CashierFormModal.vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";

const cashierStore = useCashierStore();
const { cashiers, isLoading, pagination } = storeToRefs(cashierStore);

const isDeleteModalOpen = ref(false);
const itemToDeleteId = ref(null);

const cashierToDeleteName = computed(() => {
    if (!itemToDeleteId.value) return '';
    return cashiers.value.find(c => c.id === itemToDeleteId.value)?.name || '';
});

const openDeleteModal = (id) => {
    itemToDeleteId.value = id;
    isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
    if (itemToDeleteId.value) {
        await cashierStore.removeCashier(itemToDeleteId.value);
    }
    isDeleteModalOpen.value = false;
};

onMounted(() => {
    cashierStore.fetchCashiers();
});
</script>
