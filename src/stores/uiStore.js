// File: src/stores/uiStore.js

import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  // --- State ---
  // State untuk mengontrol visibilitas modal gambar
  const isImageModalOpen = ref(false);

  // State untuk menyimpan data gambar yang akan ditampilkan
  const imageModalData = ref({
    src: "",
    title: "",
  });

  // --- Actions ---
  // Aksi untuk membuka modal dengan data tertentu
  function openImageModal(data) {
    if (data && data.src) {
      imageModalData.value = {
        src: data.src,
        title: data.title || "Image Preview", // Judul default jika tidak ada
      };
      isImageModalOpen.value = true;
    }
  }

  // Aksi untuk menutup modal dan mereset datanya
  function closeImageModal() {
    isImageModalOpen.value = false;
    // Beri sedikit jeda sebelum reset agar gambar tidak hilang saat transisi tutup
    setTimeout(() => {
      imageModalData.value = { src: "", title: "" };
    }, 300); // 300ms sesuai durasi transisi di BaseModal
  }

  return {
    isImageModalOpen,
    imageModalData,
    openImageModal,
    closeImageModal,
  };
});
