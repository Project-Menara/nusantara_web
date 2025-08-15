<template>
  <BaseModal
    :isOpen="productStore.isFormModalOpen"
    @close="closeFormModal"
    :hide-footer="isCropping"
  >
    <template #header>
      <DialogTitle as="h3" class="text-2xl font-bold ...">{{
        isEditMode ? "Edit Produk" : "Tambah Produk"
      }}</DialogTitle>
    </template>
    <template #body>
      <div class="relative">
        <div
          v-if="isEditMode && productStore.isFormLoading"
          class="absolute inset-0 ..."
        >
          <svg class="animate-spin h-8 w-8 ..."></svg>
        </div>

        <Transition name="fade" mode="out-in">
          <div v-if="isCropping" class="flex flex-col items-center">
            <ImageCropper
              ref="imageCropperRef"
              :src="imageToCrop"
              :aspect-ratio="1 / 1"
            />
            <div class="flex items-center space-x-4 mt-4">
              <button
                @click="imageCropperRef?.zoom(0.9)"
                type="button"
                class="btn-icon"
              >
                -
              </button>
              <span>Zoom</span>
              <button
                @click="imageCropperRef?.zoom(1.1)"
                type="button"
                class="btn-icon"
              >
                +
              </button>
              <button
                @click="imageCropperRef?.rotate(-90)"
                type="button"
                class="btn-icon"
              >
                ↩️
              </button>
            </div>
          </div>
          <form v-else @submit.prevent="handleSubmit" class="mt-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="name">Nama Produk</label>
                <input
                  v-model="formData.name"
                  type="text"
                  id="name"
                  class="form-input w-full"
                  required
                />
              </div>
              <div>
                <label for="code">Kode Produk</label>
                <input
                  v-model="formData.code"
                  type="text"
                  id="code"
                  class="form-input w-full"
                  required
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="price">Harga (Rp)</label>
                <input
                  v-model.number="formData.price"
                  type="number"
                  id="price"
                  class="form-input w-full"
                  required
                />
              </div>
              <div>
                <label for="unit">Unit</label>
                <input
                  v-model="formData.unit"
                  type="text"
                  id="unit"
                  class="form-input w-full"
                  placeholder="Contoh: pcs, kotak"
                  required
                />
              </div>
            </div>
            <div>
              <label for="type_product_id">Tipe Produk</label>
              <select
                v-model="formData.type_product_id"
                id="type_product_id"
                class="form-select w-full"
                required
              >
                <option disabled value="">Pilih Tipe</option>
                <option
                  v-for="type in typeProductList"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="description">Deskripsi</label>
              <textarea
                v-model="formData.description"
                id="description"
                rows="3"
                class="form-textarea w-full"
              ></textarea>
            </div>
            <div>
              <label>Gambar Utama (Cover)</label>
              <input
                @change="handleFileChange"
                type="file"
                class="form-input"
                accept="image/*"
              />
              <img
                v-if="previewUrl"
                :src="previewUrl"
                class="h-24 w-24 mt-2 object-cover rounded-md"
              />
            </div>
          </form>
        </Transition>
      </div>
    </template>
    <template #footer>
      <template v-if="isCropping">
        <button @click="cancelCrop" type="button" class="btn ...">Batal</button>
        <button @click="cropImage" type="button" class="btn bg-violet-500 ...">
          Potong
        </button>
      </template>
      <template v-else>
        <button @click="closeFormModal" type="button" class="btn ...">
          Batal
        </button>
        <button
          @click="handleSubmit"
          :disabled="productStore.isFormLoading"
          class="btn bg-violet-500 ..."
        >
          <span v-if="productStore.isFormLoading">Menyimpan...</span>
          <span v-else>{{ isEditMode ? "Simpan Perubahan" : "Tambah" }}</span>
        </button>
      </template>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useProductStore } from "../stores/useProductStore";
import { useTypeProductStore } from "@/features/type-product/presentation/stores/typeProductStore";
import { storeToRefs } from "pinia";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import ImageCropper from "@/components/ImageCropper.vue";

const productStore = useProductStore();
const isEditMode = computed(() => !!productStore.selectedProduct?.id);
const formData = ref({});

// Fetch Tipe Produk untuk dropdown
const typeProductStore = useTypeProductStore();
const { typeProductList } = storeToRefs(typeProductStore);
onMounted(() => {
  if (typeProductList.value.length === 0) {
    typeProductStore.fetchTypeProducts(1, "", true); // Tambah parameter 'all=true' jika perlu
  }
});

const isCropping = ref(false);
const imageToCrop = ref(null);
const previewUrl = ref("");
const selectedFile = ref(null);
const imageCropperRef = ref(null);

const resetForm = () => {
  formData.value = {
    name: "",
    code: "",
    price: 0,
    unit: "",
    description: "",
    type_product_id: "",
  };
  previewUrl.value = "";
  selectedFile.value = null;
};

watch(
  () => productStore.selectedProduct,
  (newProduct) => {
    if (newProduct) {
      formData.value = {
        name: newProduct.name,
        code: newProduct.code,
        price: newProduct.price,
        unit: newProduct.unit,
        description: newProduct.description,
        type_product_id: newProduct.typeProduct?.id, // Ambil ID dari objek bersarang
      };
      previewUrl.value = newProduct.coverImage;
    }
  }
);
watch(
  () => productStore.isFormModalOpen,
  (isOpen) => {
    if (isOpen && !productStore.selectedProduct) resetForm();
  }
);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageToCrop.value = e.target.result;
    isCropping.value = true;
  };
  reader.readAsDataURL(file);
  event.target.value = "";
};

const handleCrop = (blob) => {
  selectedFile.value = new File([blob], "cover.jpg", { type: "image/jpeg" });
  previewUrl.value = URL.createObjectURL(blob);
  isCropping.value = false;
};

const cropImage = () => {
  const { canvas } = imageCropperRef.value.getResult();
  if (canvas) {
    canvas.toBlob((blob) => {
      if (blob) handleCrop(blob);
    }, "image/jpeg");
  }
};

const cancelCrop = () => {
  isCropping.value = false;
};

const handleSubmit = () => {
  const data = new FormData();
  Object.keys(formData.value).forEach((key) => {
    data.append(key, formData.value[key]);
  });
  if (selectedFile.value) {
    data.append(isEditMode.value ? "new_cover" : "cover", selectedFile.value);
  }
  // Untuk edit, method spoofing
  if (isEditMode.value) data.append("_method", "PUT");

  productStore.submitProduct(data);
};

const closeFormModal = () => {
  productStore.isFormModalOpen = false;
};
</script>
