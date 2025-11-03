<template>
  <BaseModal :isOpen="eventStore.isFormModalOpen" @close="closeFormModal" size="2xl">
    <template #header>
      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
        {{ isEditMode ? "Edit Event" : "Tambah Event" }}
      </DialogTitle>
    </template>
    <template #body>
      <div class="relative">
        <div v-if="eventStore.isFormLoading"
          class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-20 rounded-lg">
          <svg class="animate-spin h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nama Event</label>
              <input v-model="formData.name" type="text" class="form-input w-full"
                placeholder="Contoh: Event August Special Deals" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tipe Event</label>
              <select v-model="formData.typeEvent" class="form-select w-full" required :disabled="isEditMode">
                <option value="BUNDLE">Bundle</option>
                <option value="DISKON">Diskon</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tanggal Mulai</label>
              <input v-model="formData.startDate" type="datetime-local" class="form-input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tanggal Selesai</label>
              <input v-model="formData.endDate" type="datetime-local" class="form-input w-full" required />
            </div>
          </div>

          <div v-if="formData.typeEvent === 'BUNDLE'" class="space-y-4 pt-4 border-t">
            <div>
              <ProductSelector label="Produk yang Harus Dibeli" @addProduct="addProductToBundleBuy" />
              <div v-if="formData.eventBundleBuys.length"
                class="mt-4 flex flex-wrap gap-3 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                <div v-for="(item, index) in formData.eventBundleBuys" :key="item.product.id"
                  class="relative w-40 bg-white dark:bg-gray-700 rounded-md shadow-sm border dark:border-gray-600 flex flex-col overflow-hidden">

                  <button @click="removeBundleBuyItem(index)" type="button"
                    class="absolute top-1 right-1  w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                    title="Hapus produk">
                    <TrashIcon class="h-4 w-4" />
                  </button>

                  <img :src="item.product.coverImage || item.product.image" class="w-full h-20 object-cover"
                    alt="Produk" />

                  <div class="p-2 flex-grow">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" :title="item.product.name">
                      {{ item.product.name }}</p>
                    <p class="text-xs text-gray-500">{{ item.product.code }}</p>
                  </div>

                  <div class="p-2 pt-0">
                    <label class="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Kuantitas</label>
                    <input v-model.number="item.quantity" type="number" min="1" class="form-input w-full text-center" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ProductSelector label="Hadiah Produk (Reward)" @addProduct="addProductToBundleReward" />
              <div v-if="formData.eventBundleRewards.length"
                class="mt-4 flex flex-wrap gap-3 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                <div v-for="(item, index) in formData.eventBundleRewards" :key="item.product.id"
                  class="relative w-40 bg-white dark:bg-gray-700 rounded-md shadow-sm border dark:border-gray-600 flex flex-col overflow-hidden">

                  <button @click="removeBundleRewardItem(index)" type="button"
                    class="absolute top-1 right-1  w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                    title="Hapus produk">
                    <TrashIcon class="h-4 w-4" />
                  </button>
                  <img :src="item.product.coverImage || item.product.image" class="w-full h-20 object-cover"
                    alt="Produk" />
                  <div class="p-2 flex-grow">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" :title="item.product.name">
                      {{ item.product.name }}</p>
                    <p class="text-xs text-gray-500">{{ item.product.code }}</p>
                  </div>
                  <div class="p-2 pt-0">
                    <label class="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Kuantitas</label>
                    <input v-model.number="item.quantity" type="number" min="1" class="form-input w-full text-center" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="formData.typeEvent === 'DISKON'" class="space-y-4 pt-4 border-t">
            <ProductSelector label="Produk yang Didiskon" @addProduct="addProductToDiscount" />
            <div v-if="formData.eventProducts.length"
              class="mt-4 flex flex-wrap justify-around gap-3 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">

              <div v-for="(item, index) in formData.eventProducts" :key="item.product.id"
                class="relative w-48 bg-white dark:bg-gray-700 rounded-md shadow-sm border dark:border-gray-600 flex flex-col overflow-hidden">

                <button @click="removeDiscountItem(index)" type="button"
                  class="absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                  title="Hapus produk">
                  <TrashIcon class="h-4 w-4" />
                </button>

                <img :src="item.product.coverImage || item.product.image" class="w-full h-24 object-cover"
                  alt="Produk" />

                <div class="p-2 flex-grow">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" :title="item.product.name">{{
                    item.product.name }}</p>
                  <p class="text-xs text-gray-500">{{ item.product.code }}</p>
                </div>

                <div class="p-2 pt-0">
                  <label class="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Diskon (%)</label>
                  <div class="relative">
                    <input v-model.number="item.discount_percent" type="number" min="1" max="100"
                      class="form-input w-full text-center pr-6" placeholder="0" />
                    <span
                      class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 dark:text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Cover</label>
            <input @change="handleFileChange" type="file" class="form-input" accept="image/*" />
            <img v-if="previewUrl" :src="previewUrl" class="h-24 w-48 mt-2 object-cover rounded" />
          </div>
        </form>
      </div>
    </template>

    <template #footer>
      <button @click="closeFormModal" type="button"
        class="btn border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500">Batal</button>
      <button @click="handleSubmit" :disabled="eventStore.isFormLoading" class="btn bg-violet-500 text-white">
        {{ isEditMode ? "Simpan Perubahan" : "Tambah" }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useEventStore } from "@/features/event/presentation/stores/useEventStore";
// ✅ PERBAIKAN: Hapus import productStore karena tidak lagi digunakan di sini
// import { useProductStore } from "@/features/product/presentation/stores/useProductStore";
import BaseModal from "@/components/modals/BaseModal.vue";
import ProductSelector from './ProductSelector.vue';
import { DialogTitle } from "@headlessui/vue";
import { format, parseISO } from 'date-fns';
import { TrashIcon } from '@heroicons/vue/20/solid'; // Pastikan ini diimpor

const eventStore = useEventStore();
const isEditMode = computed(() => !!eventStore.selectedEvent?.id);

const formData = ref({});
const selectedFile = ref(null);
const previewUrl = ref("");

const formatDateForInput = (dateString) => dateString ? format(parseISO(dateString), "yyyy-MM-dd'T'HH:mm") : '';

const resetForm = () => {
  formData.value = {
    name: "",
    typeEvent: "BUNDLE",
    startDate: '',
    endDate: '',
    eventBundleBuys: [],
    eventBundleRewards: [],
    eventProducts: [],
  };
  previewUrl.value = "";
  selectedFile.value = null;
};

// Watcher untuk mengisi form saat mode edit
watch(() => eventStore.selectedEvent, (newEvent) => {
  if (newEvent) {

    // ✅ LOG PERTAMA: Periksa data mentah dari store
    // console.log("===== DATA MENTAH DARI STORE (newEvent) =====");
    // console.log(newEvent);
    // if (newEvent.eventBundleBuy && newEvent.eventBundleBuy.length > 0) {
    //   console.log("Produk pertama di 'newEvent.eventBundleBuy':", newEvent.eventBundleBuy[0].product);
    // }

    formData.value = {
      name: newEvent.name,
      typeEvent: newEvent.typeEvent,
      startDate: formatDateForInput(newEvent.startDate),
      endDate: formatDateForInput(newEvent.endDate),
      // ✅ PERBAIKAN: Pastikan ini menyimpan seluruh objek 'product'
      eventBundleBuys: newEvent.eventBundleBuy?.map(item => ({
        product: item.product,
        quantity: item.quantity
      })) || [],
      eventBundleRewards: newEvent.eventBundleReward?.map(item => ({
        product: item.product,
        quantity: item.quantity
      })) || [],
      eventProducts: newEvent.eventProducts?.map(item => ({
        product: item.product,
        discount_percent: item.discountPercent
      })) || [],
    };
    previewUrl.value = newEvent.cover;
    selectedFile.value = null;

    // ✅ LOG KEDUA: Periksa data yang sudah diproses untuk form
    // console.log("===== DATA SETELAH DIPROSES (formData) =====");
    // console.log(formData.value);
    // if (formData.value.eventBundleBuys && formData.value.eventBundleBuys.length > 0) {
    //   console.log("Produk pertama di 'formData.eventBundleBuys':", formData.value.eventBundleBuys[0].product);
    // }
  }
});

// Watcher untuk reset form
watch(() => eventStore.isFormModalOpen, (isOpen) => { if (isOpen && !isEditMode.value) resetForm(); });

onMounted(resetForm);

// --- Handler untuk Menambah & Menghapus Produk ---
// ✅ PERBAIKAN: Pastikan fungsi 'add' menyimpan seluruh objek
const addProductToBundleBuy = (product) => {
  if (!formData.value.eventBundleBuys.some(p => p.product.id === product.id)) {
    formData.value.eventBundleBuys.push({ product: product, quantity: 1 });
  }
};
const addProductToBundleReward = (product) => {
  if (!formData.value.eventBundleRewards.some(p => p.product.id === product.id)) {
    formData.value.eventBundleRewards.push({ product: product, quantity: 1 });
  }
};
const addProductToDiscount = (product) => {
  if (!formData.value.eventProducts.some(p => p.product.id === product.id)) {
    formData.value.eventProducts.push({ product: product, discount_percent: 10 });
  }
};

const removeBundleBuyItem = (index) => formData.value.eventBundleBuys.splice(index, 1);
const removeBundleRewardItem = (index) => formData.value.eventBundleRewards.splice(index, 1);
const removeDiscountItem = (index) => formData.value.eventProducts.splice(index, 1);
// --- End Handler ---

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const handleSubmit = () => {
  const data = new FormData();

  data.append("name", formData.value.name);
  data.append("type_event", formData.value.typeEvent);
  data.append("start_date", new Date(formData.value.startDate).toISOString());
  data.append("end_date", new Date(formData.value.endDate).toISOString());

  // ✅ PERBAIKAN: Pastikan data dipetakan kembali ke format API
  if (formData.value.typeEvent === 'BUNDLE') {
    const bundleBuysForAPI = formData.value.eventBundleBuys.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }));
    const bundleRewardsForAPI = formData.value.eventBundleRewards.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }));

    data.append("event_bundle_buys", JSON.stringify(bundleBuysForAPI));
    data.append("event_bundle_rewards", JSON.stringify(bundleRewardsForAPI));

  } else if (formData.value.typeEvent === 'DISKON') {
    const productsForAPI = formData.value.eventProducts.map(item => ({
      product_id: item.product.id,
      discount_percent: item.discount_percent
    }));
    data.append("event_products", JSON.stringify(productsForAPI));
  }

  const coverKey = isEditMode.value ? "new_cover" : "cover";
  if (selectedFile.value) data.append(coverKey, selectedFile.value);
  if (!isEditMode.value) data.append("status", 0);

  eventStore.submitEvent(data);
};

const closeFormModal = () => { eventStore.isFormModalOpen = false; };
</script>