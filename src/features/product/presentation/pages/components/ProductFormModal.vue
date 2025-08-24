<template>
  <BaseModal :isOpen="productStore.isFormModalOpen" @close="closeFormModal">
    <template #header>
      <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
        {{ isEditMode ? "Edit Produk" : "Tambah Produk" }}
      </DialogTitle>
    </template>
    <template #body>
      <div class="relative">
        <div v-if="isEditMode && productStore.isFormLoading"
          class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-10 rounded-lg">
          <svg class="animate-spin h-8 w-8 text-violet-600" xmlns="http://www.w.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium mb-1">Nama Produk</label>
              <input v-model="formData.name" type="text" id="name" class="form-input w-full" required
                :disabled="productStore.isFormLoading" />
            </div>
            <div>
              <label for="code" class="block text-sm font-medium mb-1">Kode Produk</label>
              <input v-model="formData.code" type="text" id="code" class="form-input w-full" required
                :disabled="productStore.isFormLoading" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="price" class="block text-sm font-medium mb-1">Harga (Rp)</label>
              <input v-model.number="formData.price" type="number" id="price" class="form-input w-full" required
                :disabled="productStore.isFormLoading" />
            </div>
            <div>
              <label for="unit" class="block text-sm font-medium mb-1">Unit</label>
              <input v-model="formData.unit" type="text" id="unit" class="form-input w-full"
                placeholder="Contoh: pcs, kotak" required :disabled="productStore.isFormLoading" />
            </div>
          </div>
          <div>
            <label for="type_product_id" class="block text-sm font-medium mb-1">Tipe Produk</label>
            <select v-model="formData.type_product_id" id="type_product_id" class="form-select w-full" required
              :disabled="productStore.isFormLoading">
              <option disabled value="">Pilih Tipe</option>
              <option v-for="type in typeProductList" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="description" class="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea v-model="formData.description" id="description" rows="3" class="form-textarea w-full"
              :disabled="productStore.isFormLoading"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Gambar Utama (Cover)</label>
            <input @change="handleFileChange" type="file" class="form-input w-full" accept="image/*"
              :disabled="productStore.isFormLoading" />
            <img v-if="previewUrl" :src="previewUrl" class="h-24 w-24 mt-2 object-cover rounded-md shadow-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Galeri Gambar (Bisa pilih lebih dari satu)</label>
            <input @change="handleGalleryFilesChange" type="file" multiple class="form-input w-full" accept="image/*"
              :disabled="productStore.isFormLoading" />
            <div v-if="galleryPreviewUrls.length" class="mt-3 flex flex-wrap gap-2">
              <div v-for="(url, index) in galleryPreviewUrls" :key="index" class="relative">
                <img :src="url" class="h-24 w-24 object-cover rounded-md shadow-lg" />
                <button @click="removeGalleryImage(index)" type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold"
                  title="Hapus gambar">
                  &times;
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button @click="closeFormModal" type="button"
        class="btn border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
        Batal
      </button>
      <div class="relative inline-block group">
        <button @click="handleSubmit" :disabled="isButtonDisabled"
          class="btn bg-violet-500 hover:bg-violet-600 text-white disabled:bg-gray-400">
          <span v-if="productStore.isFormLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Menyimpan...
          </span>
          <span v-else>{{ isEditMode ? "Simpan Perubahan" : "Tambah" }}</span>
        </button>
        <span v-if="isButtonDisabled && !productStore.isFormLoading"
          class="invisible group-hover:visible absolute bottom-full ...">
          {{ tooltipMessage }}
        </span>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useProductStore } from "../../stores/useProductStore";
import { useTypeProductStore } from "@/features/type-product/presentation/stores/typeProductStore";
import { storeToRefs } from "pinia";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";

const productStore = useProductStore();
const isEditMode = computed(() => !!productStore.selectedProduct?.id);
const formData = ref({});
const previewUrl = ref("");
const selectedFile = ref(null);
const originalData = ref(null);
const galleryInput = ref(null);

const selectedGalleryFiles = ref([]);
const galleryPreviewUrls = ref([]);
// ✅ TAMBAHAN: State untuk mencatat URL gambar lama yang dihapus
const deletedGalleryUrls = ref(new Set());


const typeProductStore = useTypeProductStore();
const { typeProductList } = storeToRefs(typeProductStore);

onMounted(() => {
  if (typeProductList.value.length === 0) {
    typeProductStore.fetchTypeProducts(1, "", true);
  }
});

const resetForm = () => {
  formData.value = {
    name: "", code: "", price: null, unit: "", description: "", type_product_id: "",
  };
  previewUrl.value = "";
  selectedFile.value = null;
  originalData.value = null;
  selectedGalleryFiles.value = [];
  galleryPreviewUrls.value = [];
  deletedGalleryUrls.value.clear(); // ✅ Reset gambar yang dihapus
};

watch(
  () => productStore.selectedProduct,
  (newProduct) => {
    if (newProduct) {
      const dataToEdit = {
        name: newProduct.name, code: newProduct.code, price: newProduct.price,
        unit: newProduct.unit, description: newProduct.description, type_product_id: newProduct.typeProductId,
      };
      formData.value = { ...dataToEdit };
      originalData.value = { ...dataToEdit };
      previewUrl.value = newProduct.coverImage;
      selectedFile.value = null;
      galleryPreviewUrls.value = [...newProduct.productImages];
      selectedGalleryFiles.value = [];
      deletedGalleryUrls.value.clear(); 
    }
  }
);

watch(
  () => productStore.isFormModalOpen,
  (isOpen) => {
    if (isOpen && !productStore.selectedProduct) {
      resetForm();
    }
  }
);

const handleGalleryFilesChange = (event) => {
  const files = event.target.files;
  for (const file of files) {
    selectedGalleryFiles.value.push(file);
    galleryPreviewUrls.value.push(URL.createObjectURL(file));
  }
  if (galleryInput.value) galleryInput.value.value = null;
};

// ✅ FUNGSI removeGalleryImage DIPERBARUI
const removeGalleryImage = (index) => {
  const removedUrl = galleryPreviewUrls.value[index];

  // Cek apakah yang dihapus adalah URL dari server (bukan blob URL)
  if (removedUrl && !removedUrl.startsWith('blob:')) {
    deletedGalleryUrls.value.add(removedUrl);
  }

  // Cari file yang sesuai di selectedGalleryFiles berdasarkan URL previewnya
  const fileIndex = selectedGalleryFiles.value.findIndex(file =>
    URL.createObjectURL(file) === removedUrl
  );

  // Hapus dari kedua array
  galleryPreviewUrls.value.splice(index, 1);
  if (fileIndex > -1) {
    selectedGalleryFiles.value.splice(fileIndex, 1);
  }
};

const isButtonDisabled = computed(() => {
  if (productStore.isFormLoading) return true;
  if (isEditMode.value) {
    const hasDataChanged = JSON.stringify(formData.value) !== JSON.stringify(originalData.value);
    const hasNewCover = !!selectedFile.value;
    const hasNewGalleryFiles = selectedGalleryFiles.value.length > 0;
    const hasDeletedGalleryImages = deletedGalleryUrls.value.size > 0;

    return !hasDataChanged && !hasNewCover && !hasNewGalleryFiles && !hasDeletedGalleryImages;
  } else {
    return !formData.value.name || !selectedFile.value;
  }
});

const tooltipMessage = computed(() => {
  if (isEditMode.value) {
    return "Lakukan perubahan pada data atau gambar terlebih dahulu.";
  }
  return "Nama produk dan Gambar Utama wajib diisi.";
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

// ✅ Helper untuk mengubah URL ke Blob
async function urlToBlob(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
}

// ✅ FUNGSI handleSubmit DIPERBARUI TOTAL
const handleSubmit = async () => {
  if (isButtonDisabled.value) return;
  const data = new FormData();

  // Append data form teks
  Object.keys(formData.value).forEach((key) => {
    if (formData.value[key] !== null) {
      data.append(key, formData.value[key]);
    }
  });

  // Append cover
  const coverKey = isEditMode.value ? "new_cover" : "cover";
  if (selectedFile.value) {
    data.append(coverKey, selectedFile.value);
  }

  // Logika untuk Mode Tambah
  if (!isEditMode.value) {
    data.append("status", 1);
    if (selectedGalleryFiles.value.length > 0) {
      selectedGalleryFiles.value.forEach(file => {
        data.append("gallery", file);
      });
    }
  }
  // Logika untuk Mode Edit
  else {
    data.append("_method", "PUT");

    const hasNewGalleryFiles = selectedGalleryFiles.value.length > 0;
    const hasDeletedGalleryImages = deletedGalleryUrls.value.size > 0;

    // Hanya set replace_gallery ke true jika ada perubahan pada galeri
    if (hasNewGalleryFiles || hasDeletedGalleryImages) {
      data.append("replace_gallery", "true");

      // Filter gambar lama yang TIDAK dihapus
      const existingUrlsToKeep = productStore.selectedProduct.productImages.filter(
        url => !deletedGalleryUrls.value.has(url)
      );

      // Kirim ulang gambar lama yang dipertahankan sebagai blob
      for (const url of existingUrlsToKeep) {
        const blob = await urlToBlob(url);
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        data.append("new_gallery", blob, fileName);
      }

      // Tambahkan gambar baru
      selectedGalleryFiles.value.forEach(file => {
        data.append("new_gallery", file);
      });

    } else {
      // Jika tidak ada perubahan galeri, kirim false
      data.append("replace_gallery", "false");
    }
  }

  productStore.submitProduct(data);
};

const closeFormModal = () => {
  productStore.isFormModalOpen = false;
};
</script>