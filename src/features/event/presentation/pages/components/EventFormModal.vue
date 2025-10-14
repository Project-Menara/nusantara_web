<template>
  <BaseModal :isOpen="eventStore.isFormModalOpen" @close="closeFormModal">
    <template #header>
      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
        {{ isEditMode ? "Edit Event" : "Tambah Event" }}
      </DialogTitle>
    </template>
    <template #body>
      <div class="relative">
        <div v-if="isEditMode && eventStore.isFormLoading" class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-10 rounded-lg">
          <svg class="animate-spin h-8 w-8 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium mb-1">Nama Event</label>
              <input v-model="formData.name" type="text" id="name" class="form-input w-full" required :disabled="eventStore.isFormLoading" />
            </div>
            <div>
              <label for="type_event" class="block text-sm font-medium mb-1">Tipe Event</label>
              <select v-model="formData.typeEvent" id="type_event" class="form-select w-full" required :disabled="eventStore.isFormLoading">
                <option value="BUNDLE">BUNDLE</option>
                </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="start_date" class="block text-sm font-medium mb-1">Tanggal Mulai</label>
              <input v-model="formData.startDate" type="datetime-local" id="start_date" class="form-input w-full" required :disabled="eventStore.isFormLoading" />
            </div>
            <div>
              <label for="end_date" class="block text-sm font-medium mb-1">Tanggal Selesai</label>
              <input v-model="formData.endDate" type="datetime-local" id="end_date" class="form-input w-full" required :disabled="eventStore.isFormLoading" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Gambar Cover</label>
            <input @change="handleFileChange" type="file" class="form-input w-full" accept="image/png, image/jpeg" :disabled="eventStore.isFormLoading" />
            <div v-if="previewUrl" class="mt-2">
              <img :src="previewUrl" class="h-24 w-48 object-cover rounded shadow-sm border" />
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium">Bundle Beli</h4>
            <p class="text-xs text-gray-500">Produk yang harus dibeli customer.</p>
            </div>
           <div>
            <h4 class="text-sm font-medium">Bundle Reward</h4>
            <p class="text-xs text-gray-500">Produk yang didapat customer sebagai hadiah.</p>
            </div>

        </form>
      </div>
    </template>
    <template #footer>
      <button @click="closeFormModal" type="button" class="btn border-gray-300 text-gray-700">Batal</button>
      <button @click="handleSubmit" :disabled="eventStore.isFormLoading" class="btn bg-violet-500 hover:bg-violet-600 text-white disabled:bg-gray-400">
        <span v-if="eventStore.isFormLoading">Menyimpan...</span>
        <span v-else>{{ isEditMode ? "Simpan Perubahan" : "Tambah" }}</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useEventStore } from "@/features/event/presentation/stores/useEventStore";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import { format, parseISO } from 'date-fns';

const eventStore = useEventStore();
const isEditMode = computed(() => !!eventStore.selectedEvent?.id);

const formData = ref({});
const selectedFile = ref(null);
const previewUrl = ref("");

// Fungsi untuk format tanggal ke YYYY-MM-DDTHH:mm yang diterima input datetime-local
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return format(parseISO(dateString), "yyyy-MM-dd'T'HH:mm");
};

// Watcher untuk mengisi form saat mode edit
watch(() => eventStore.selectedEvent, (newEvent) => {
  if (newEvent) {
    formData.value = {
      name: newEvent.name,
      typeEvent: newEvent.typeEvent,
      startDate: formatDateForInput(newEvent.startDate),
      endDate: formatDateForInput(newEvent.endDate),
      // Inisialisasi bundle dari data yang ada
      eventBundleBuys: newEvent.eventBundleBuy.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
      eventBundleRewards: newEvent.eventBundleReward.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
    };
    previewUrl.value = newEvent.cover;
    selectedFile.value = null;
  }
});

// Watcher untuk mereset form saat modal dibuka untuk "Tambah"
watch(() => eventStore.isFormModalOpen, (isOpen) => {
  if (isOpen && !eventStore.selectedEvent) {
    formData.value = {
      name: "",
      typeEvent: "BUNDLE",
      startDate: '',
      endDate: '',
      status: 0, // default status saat create
      eventBundleBuys: [],
      eventBundleRewards: []
    };
    previewUrl.value = "";
    selectedFile.value = null;
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const handleSubmit = () => {
  const data = new FormData();
  
  // Append data simple
  data.append("name", formData.value.name);
  data.append("type_event", formData.value.typeEvent);
  data.append("start_date", new Date(formData.value.startDate).toISOString());
  data.append("end_date", new Date(formData.value.endDate).toISOString());

  // Penting: Kirim array of object sebagai string JSON
  data.append("event_bundle_buys", JSON.stringify(formData.value.eventBundleBuys));
  data.append("event_bundle_rewards", JSON.stringify(formData.value.eventBundleRewards));

  // Handle file upload
  if (isEditMode.value) {
    if (selectedFile.value) {
      data.append("new_cover", selectedFile.value); // Sesuai spek API 'new_cover' untuk update
    }
  } else {
    data.append("status", 0); // Default status untuk create
    if (selectedFile.value) {
      data.append("cover", selectedFile.value);
    }
  }

  eventStore.submitEvent(data);
};

const closeFormModal = () => {
  eventStore.isFormModalOpen = false;
};
</script>