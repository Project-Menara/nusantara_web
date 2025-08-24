<!-- <template>
  <BaseModal
    :isOpen="uiStore.isImageModalOpen"
    @close="uiStore.closeImageModal"
  >
    <template #header>
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
      >
        {{ uiStore.imageModalData.title }}
      </DialogTitle>
    </template>
    <template #body>
      <div class="mt-2">
        <img
          :src="uiStore.imageModalData.src"
          :alt="uiStore.imageModalData.title"
          class="w-full h-auto object-contain rounded-md max-h-[70vh]"
        />
      </div>
    </template>
    <template #footer>
      <button
        @click="uiStore.closeImageModal"
        type="button"
        class="btn bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] text-white"
      >
        Tutup
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { useUiStore } from "@/stores/uiStore";
import BaseModal from "./BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";

const uiStore = useUiStore();
</script> -->

<template>
  <BaseModal :isOpen="uiStore.isImageModalOpen" @close="uiStore.closeImageModal">
    <template #header>
      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
        {{ uiStore.imageModalData.title }}
      </DialogTitle>
    </template>
    <template #body>
      <div class="mt-2 relative">
        <div v-if="isCarousel && imageList.length > 0" class="relative">
          <img :src="currentImage" :alt="uiStore.imageModalData.title"
            class="w-full h-auto object-contain rounded-md max-h-[70vh]" />
          <button @click="prevImage"
            class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50">
            &#10094;
          </button>
          <button @click="nextImage"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50">
            &#10095;
          </button>
          <div
            class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/30 text-white text-xs px-2 py-1 rounded-full">
            {{ currentIndex + 1 }} / {{ imageList.length }}
          </div>
        </div>

        <div v-else-if="isCarousel && imageList.length === 0" class="text-center text-gray-500 py-10">
          <p>Belum ada galeri untuk produk ini.</p>
        </div>

        <div v-else>
          <img :src="uiStore.imageModalData.src" :alt="uiStore.imageModalData.title"
            class="w-full h-auto object-contain rounded-md max-h-[70vh]" />
        </div>

      </div>
    </template>
    <template #footer>
      <button @click="uiStore.closeImageModal" type="button" class="btn bg-violet-600 hover:bg-violet-700 text-white">
        Tutup
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { useUiStore } from "@/stores/uiStore";
import BaseModal from "./BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import { ref, computed, watch } from 'vue';

const uiStore = useUiStore();
const currentIndex = ref(0);

// Computed property untuk mendeteksi apakah data adalah carousel
const isCarousel = computed(() => Array.isArray(uiStore.imageModalData.src));

// Computed property untuk mendapatkan daftar gambar (hanya jika carousel)
const imageList = computed(() => isCarousel.value ? uiStore.imageModalData.src : []);

// Computed property untuk mendapatkan URL gambar yang sedang ditampilkan
const currentImage = computed(() => {
  if (isCarousel.value && imageList.value.length > 0) {
    return imageList.value[currentIndex.value];
  }
  // Fallback untuk gambar tunggal
  return uiStore.imageModalData.src;
});

// Fungsi navigasi carousel
const nextImage = () => {
  if (imageList.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % imageList.value.length;
};

const prevImage = () => {
  if (imageList.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + imageList.value.length) % imageList.value.length;
};

// Reset index ke 0 setiap kali modal dibuka
watch(() => uiStore.isImageModalOpen, (isOpen) => {
  if (isOpen) {
    currentIndex.value = 0;
  }
});
</script>