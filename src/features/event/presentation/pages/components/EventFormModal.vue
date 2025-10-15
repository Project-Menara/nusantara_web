<template>
  <BaseModal :isOpen="eventStore.isFormModalOpen" @close="closeFormModal" size="2xl">
    <template #header>
      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
        {{ isEditMode ? "Edit Event" : "Tambah Event" }}
      </DialogTitle>
    </template>
    <template #body>
      <div class="relative">
        <div v-if="eventStore.isFormLoading" class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-20 rounded-lg">
          <svg class="animate-spin h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nama Event</label>
              <input v-model="formData.name" type="text" class="form-input w-full" required />
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
          <div>
            <label class="block text-sm font-medium mb-1">Cover</label>
            <input @change="handleFileChange" type="file" class="form-input" accept="image/*" />
            <img v-if="previewUrl" :src="previewUrl" class="h-24 w-48 mt-2 object-cover rounded" />
          </div>

          <div v-if="formData.typeEvent === 'BUNDLE'" class="space-y-4 pt-4 border-t">
            <div>
              <ProductSelector label="Produk yang Harus Dibeli" @addProduct="addProductToBundleBuy" />
              <div v-if="formData.eventBundleBuys.length" class="mt-2 space-y-2">
                <div v-for="(item, index) in formData.eventBundleBuys" :key="item.product_id" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span class="flex-grow">{{ getProductName(item.product_id) }}</span>
                  <input v-model.number="item.quantity" type="number" min="1" class="form-input w-20 text-center" />
                  <button @click="removeBundleBuyItem(index)" type="button" class="text-red-500">&times;</button>
                </div>
              </div>
            </div>
            <div>
              <ProductSelector label="Hadiah Produk (Reward)" @addProduct="addProductToBundleReward" />
              <div v-if="formData.eventBundleRewards.length" class="mt-2 space-y-2">
                <div v-for="(item, index) in formData.eventBundleRewards" :key="item.product_id" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span class="flex-grow">{{ getProductName(item.product_id) }}</span>
                  <input v-model.number="item.quantity" type="number" min="1" class="form-input w-20 text-center" />
                  <button @click="removeBundleRewardItem(index)" type="button" class="text-red-500">&times;</button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="formData.typeEvent === 'DISKON'" class="space-y-4 pt-4 border-t">
            <ProductSelector label="Produk yang Didiskon" @addProduct="addProductToDiscount" />
            <div v-if="formData.eventProducts.length" class="mt-2 space-y-2">
                <div v-for="(item, index) in formData.eventProducts" :key="item.product_id" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span class="flex-grow">{{ getProductName(item.product_id) }}</span>
                  <div class="flex items-center">
                    <input v-model.number="item.discount_percent" type="number" min="1" max="100" class="form-input w-24 text-center" />
                    <span class="ml-1">%</span>
                  </div>
                  <button @click="removeDiscountItem(index)" type="button" class="text-red-500">&times;</button>
                </div>
              </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button @click="closeFormModal" type="button" class="btn border-gray-300 text-gray-700">Batal</button>
      <button @click="handleSubmit" :disabled="eventStore.isFormLoading" class="btn bg-violet-500 text-white">
        {{ isEditMode ? "Simpan Perubahan" : "Tambah" }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useEventStore } from "@/features/event/presentation/stores/useEventStore";
import { useProductStore } from "@/features/product/presentation/stores/useProductStore";
import BaseModal from "@/components/modals/BaseModal.vue";
import ProductSelector from './ProductSelector.vue';
import { DialogTitle } from "@headlessui/vue";
import { format, parseISO } from 'date-fns';

const eventStore = useEventStore();
const productStore = useProductStore();
const isEditMode = computed(() => !!eventStore.selectedEvent?.id);

const formData = ref({});
const selectedFile = ref(null);
const previewUrl = ref("");
const productCache = ref(new Map()); // Cache untuk nama produk

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

// Fungsi untuk menyimpan dan mengambil nama produk dari cache
const cacheProduct = (product) => {
  if (product && product.id && product.name) {
    productCache.value.set(product.id, product.name);
  }
};
const getProductName = (productId) => productCache.value.get(productId) || 'Produk tidak dikenal';

// Watcher untuk mengisi form saat mode edit
watch(() => eventStore.selectedEvent, (newEvent) => {
  if (newEvent) {
    // Cache semua produk yang ada di event
    newEvent.eventBundleBuy?.forEach(item => cacheProduct(item.product));
    newEvent.eventBundleReward?.forEach(item => cacheProduct(item.product));
    newEvent.eventProducts?.forEach(item => cacheProduct(item.product));

    formData.value = {
      name: newEvent.name,
      typeEvent: newEvent.typeEvent,
      startDate: formatDateForInput(newEvent.startDate),
      endDate: formatDateForInput(newEvent.endDate),
      eventBundleBuys: newEvent.eventBundleBuy?.map(item => ({ product_id: item.product.id, quantity: item.quantity })) || [],
      eventBundleRewards: newEvent.eventBundleReward?.map(item => ({ product_id: item.product.id, quantity: item.quantity })) || [],
      eventProducts: newEvent.eventProducts?.map(item => ({ product_id: item.product.id, discount_percent: item.discountPercent })) || [],
    };
    previewUrl.value = newEvent.cover;
    selectedFile.value = null;
  }
});

// Watcher untuk reset form
watch(() => eventStore.isFormModalOpen, (isOpen) => { if (isOpen && !isEditMode.value) resetForm(); });

onMounted(resetForm);

// --- Handler untuk Menambah & Menghapus Produk ---
const addProductToBundleBuy = (product) => {
  if (!formData.value.eventBundleBuys.some(p => p.product_id === product.id)) {
    cacheProduct(product);
    formData.value.eventBundleBuys.push({ product_id: product.id, quantity: 1 });
  }
};
const addProductToBundleReward = (product) => {
  if (!formData.value.eventBundleRewards.some(p => p.product_id === product.id)) {
    cacheProduct(product);
    formData.value.eventBundleRewards.push({ product_id: product.id, quantity: 1 });
  }
};
const addProductToDiscount = (product) => {
  if (!formData.value.eventProducts.some(p => p.product_id === product.id)) {
    cacheProduct(product);
    formData.value.eventProducts.push({ product_id: product.id, discount_percent: 10 });
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

  if (formData.value.typeEvent === 'BUNDLE') {
    data.append("event_bundle_buys", JSON.stringify(formData.value.eventBundleBuys));
    data.append("event_bundle_rewards", JSON.stringify(formData.value.eventBundleRewards));
  } else if (formData.value.typeEvent === 'DISKON') {
    data.append("event_products", JSON.stringify(formData.value.eventProducts));
  }

  const coverKey = isEditMode.value ? "new_cover" : "cover";
  if (selectedFile.value) data.append(coverKey, selectedFile.value);
  if (!isEditMode.value) data.append("status", 0);
  
  eventStore.submitEvent(data);
};

const closeFormModal = () => { eventStore.isFormModalOpen = false; };
</script>