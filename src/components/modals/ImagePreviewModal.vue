<template>
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
</script>
