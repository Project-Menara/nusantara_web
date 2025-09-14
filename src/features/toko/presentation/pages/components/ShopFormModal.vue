<template>
    <BaseModal :isOpen="shopStore.isFormModalOpen" @close="closeFormModal" size="4xl">
        <template #header>
            <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
                {{ isEditMode ? "Edit Toko" : "Tambah Toko" }}
            </DialogTitle>
        </template>

        <template #body>
            <div class="relative min-h-[60vh]">
                <!-- Loading Overlay -->
                <div v-if="isFetchingRelatedData"
                    class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-20 rounded-lg">
                    <svg class="animate-spin h-8 w-8 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </div>

                <!-- Form akan dirender hanya setelah semua data siap -->
                <div v-if="!isFetchingRelatedData" class="mt-6">
                    <!-- Step Indicator -->
                    <div class="mb-6">
                        <div class="flex items-center">
                            <template v-for="(step, index) in steps" :key="index">
                                <div class="flex items-center">
                                    <div class="flex items-center justify-center w-10 h-10 rounded-full"
                                        :class="currentStep >= index + 1 ? 'bg-violet-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'">
                                        {{ index + 1 }}
                                    </div>
                                    <div class="ml-4">
                                        <h4 class="font-semibold"
                                            :class="currentStep >= index + 1 ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500'">
                                            {{ step.title }}</h4>
                                        <p class="text-sm text-gray-500">{{ step.description }}</p>
                                    </div>
                                </div>
                                <div v-if="index < steps.length - 1" class="flex-auto border-t-2 mx-4"
                                    :class="currentStep > index + 1 ? 'border-violet-500' : 'border-gray-200 dark:border-gray-700'">
                                </div>
                            </template>
                        </div>
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Step 1: Informasi & Lokasi -->
                        <div v-show="currentStep === 1">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label for="name" class="block text-sm font-medium mb-1">Nama Toko</label>
                                    <input v-model="formData.name" type="text" id="name" class="form-input w-full"
                                        required />
                                </div>
                                <div>
                                    <label for="description" class="block text-sm font-medium mb-1">Deskripsi</label>
                                    <input v-model="formData.description" type="text" id="description"
                                        class="form-input w-full" required />
                                </div>
                            </div>
                            <div>
                                <h4 class="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100">Lokasi Toko</h4>
                                <LocationPicker :lat="lat" :lng="lng" :address="address" :initMap="initMap" />
                            </div>
                        </div>

                        <!-- Step 2: Produk & Kasir -->
                        <div v-show="currentStep === 2" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium mb-1">Pilih Kasir</label>
                                <v-select multiple v-model="selectedCashierIds" :options="cashierList" label="name"
                                    :reduce="cashier => cashier.id" placeholder="Ketik untuk mencari kasir..."
                                    class="style-chooser"></v-select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Tambah Produk ke Toko</label>
                                <v-select v-model="productToAdd" :options="filteredProducts" label="name"
                                    placeholder="Ketik untuk mencari produk..." class="style-chooser">
                                    <template #option="{ name, code }">
                                        <div class="flex flex-col"><span class="font-semibold">{{ name }}</span><span
                                                class="text-xs text-gray-500">{{ code }}</span></div>
                                    </template>
                                </v-select>
                                <div v-if="selectedProducts.length" class="mt-4">
                                    <!-- Tabel Produk Terpilih -->
                                </div>
                            </div>
                        </div>

                        <!-- Step 3: Gambar & Galeri -->
                        <div v-show="currentStep === 3">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Gambar Utama (Cover)</label>
                                    <input @change="handleCoverFileChange" type="file" class="form-input w-full"
                                        accept="image/*" ref="coverInput" />
                                    <img v-if="coverPreview" :src="coverPreview"
                                        class="h-24 w-24 mt-2 object-cover rounded-md shadow-lg" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Galeri Gambar</label>
                                    <input @change="handleGalleryFilesChange" type="file" multiple
                                        class="form-input w-full" accept="image/*" ref="galleryInput" />
                                    <div v-if="galleryItems.length" class="mt-2 flex flex-wrap gap-2">
                                        <div v-for="(item, index) in galleryItems" :key="index" class="relative">
                                            <img :src="item.url" class="h-24 w-24 object-cover rounded-md shadow-lg" />
                                            <button @click="removeGalleryImage(index)" type="button"
                                                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6">&times;</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-between w-full">
                <!-- Tombol Kembali -->
                <button v-if="currentStep > 1" @click="prevStep" type="button"
                    class="btn border-gray-300 dark:border-gray-600">Kembali</button>
                <div v-else></div> <!-- Placeholder untuk menjaga layout -->

                <!-- Tombol Berikutnya / Simpan -->
                <div>
                    <button v-if="currentStep < steps.length" @click="nextStep" type="button"
                        class="btn bg-violet-500 hover:bg-violet-600 text-white"
                        :disabled="!isStepValid">Berikutnya</button>
                    <button v-if="currentStep === steps.length" @click="handleSubmit"
                        :disabled="shopStore.isFormLoading || isFetchingRelatedData"
                        class="btn bg-violet-500 hover:bg-violet-600 text-white">
                        <span v-if="shopStore.isFormLoading">Menyimpan...</span>
                        <span v-else>{{ isEditMode ? "Simpan Perubahan" : "Tambah Toko" }}</span>
                    </button>
                </div>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useShopStore } from "../../stores/useShopStore";
import { useCashierStore } from "@/features/cashier/presentation/stores/useCashierStore";
import { useProductStore } from "@/features/product/presentation/stores/useProductStore";
import { storeToRefs } from "pinia";
import BaseModal from "@/components/modals/BaseModal.vue";
import LocationPicker from '@/components/LocationPicker.vue';
import { useGoogleMaps } from '@/composables/useGoogleMaps';
import { DialogTitle } from "@headlessui/vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// --- State Baru untuk Multi-Step Form ---
const currentStep = ref(1);
const steps = [
    { title: 'Info & Lokasi', description: '' },
    { title: 'Produk & Kasir', description: '' },
    { title: 'Gambar', description: '' }
];

// --- Stores ---
const shopStore = useShopStore();
const cashierStore = useCashierStore();
const productStore = useProductStore();
const { selectedShop } = storeToRefs(shopStore);
const { cashiers: cashierList } = storeToRefs(cashierStore);
const { productList } = storeToRefs(productStore);

// --- State ---
const isEditMode = computed(() => !!selectedShop.value?.id);
const formData = ref({});
const selectedCashierIds = ref([]);
const selectedProducts = ref([]);
const productToAdd = ref(null);
const isFetchingRelatedData = ref(false);

const coverFile = ref(null);
const coverPreview = ref('');
const galleryItems = ref([]); // { file: File|null, url: string, isExisting: boolean }
const coverInput = ref(null);
const galleryInput = ref(null);


// --- Google Maps ---
const { lat, lng, address, initMap } = useGoogleMaps();

// --- Computed ---
const filteredProducts = computed(() => {
    return productList.value.filter(p =>
        !selectedProducts.value.some(sp => sp.id === p.id)
    );
});

function populateFormForEdit(shop) {
    formData.value = { name: shop.name, description: shop.description };
    lat.value = shop.lat;
    lng.value = shop.lng;
    address.value = shop.fullAddress;
    selectedCashierIds.value = shop.cashiers.map(c => c.id);
    selectedProducts.value = shop.products.map(p => ({
        id: p.id, name: p.name, stock: p.stock || 0,
        price: p.price || null, status: p.isActive ? 1 : 0,
    }));
    coverPreview.value = shop.cover;
    galleryItems.value = shop.gallery.map(url => ({ file: null, url, isExisting: true }));
}

// --- Watchers ---
watch(productToAdd, (newlySelectedProduct) => {
    if (newlySelectedProduct) {
        addProductToShop(newlySelectedProduct);
        productToAdd.value = null;
    }
});

watch(() => shopStore.isFormModalOpen, (isOpen) => {
    if (isOpen) {
        setupForm();
    }
});

// --- Methods ---
function resetForm() {
    formData.value = { name: '', description: '' };
    lat.value = -6.2088;
    lng.value = 106.8456;
    address.value = '';
    selectedCashierIds.value = [];
    selectedProducts.value = [];
    coverFile.value = null;
    coverPreview.value = '';
    galleryItems.value = [];
    currentStep.value = 1
    if (coverInput.value) coverInput.value.value = null;
    if (galleryInput.value) galleryInput.value.value = null;
}

async function setupForm() {
    isFetchingRelatedData.value = true;
    await Promise.all([
        cashierStore.fetchCashiers(1, '', true),
        productStore.fetchProducts(1, '', true)
    ]);
    if (isEditMode.value && selectedShop.value) {
        populateFormForEdit(selectedShop.value);
    } else {
        resetForm();
    }
    isFetchingRelatedData.value = false;
}

function handleCoverFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    coverFile.value = file;
    coverPreview.value = URL.createObjectURL(file);
}

function handleGalleryFilesChange(event) {
    const files = event.target.files;
    for (const file of files) {
        galleryItems.value.push({ file, url: URL.createObjectURL(file), isExisting: false });
    }
    if (galleryInput.value) galleryInput.value.value = null;
}

function removeGalleryImage(index) {
    galleryItems.value.splice(index, 1);
}

function addProductToShop(product) {
    selectedProducts.value.push({
        id: product.id, name: product.name, stock: 0,
        price: null, status: 1,
    });
}

function removeProductFromShop(index) {
    selectedProducts.value.splice(index, 1);
}

async function urlToBlob(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}

// --- Computed untuk Validasi Langkah ---
const isStepValid = computed(() => {
    if (currentStep.value === 1) {
        return formData.value.name && formData.value.description && address.value;
    }
    if (currentStep.value === 2) {
        return selectedCashierIds.value.length > 0 && selectedProducts.value.length > 0;
    }
    return true; // Langkah 3 tidak ada validasi wajib sebelum submit
});

// --- Navigasi ---
function nextStep() {
    if (isStepValid.value && currentStep.value < steps.length) {
        currentStep.value++;
    }
}

function prevStep() {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
}

async function handleSubmit() {
    const data = new FormData();

    data.append('name', formData.value.name);
    data.append('description', formData.value.description);
    data.append('full_address', address.value);
    data.append('lat', lat.value);
    data.append('lang', lng.value);

    data.append('cashier_ids', JSON.stringify(selectedCashierIds.value));
    const productsPayload = selectedProducts.value.map(p => ({
        product_id: p.id, stock: p.stock,
        ...(p.price && { price: p.price }),
        status: p.status,
    }));
    data.append('products', JSON.stringify(productsPayload));

    if (!isEditMode.value) {
        data.append('status', 1);
        if (coverFile.value) data.append('cover', coverFile.value);
        galleryItems.value.forEach(item => {
            if (item.file) data.append('gallery', item.file);
        });
    } else {
        if (coverFile.value) data.append('new_cover', coverFile.value);

        const originalImageUrls = selectedShop.value?.gallery || [];
        const currentImageUrls = galleryItems.value.map(item => item.url);
        const hasGalleryChanged = JSON.stringify(originalImageUrls) !== JSON.stringify(currentImageUrls.filter(url => !url.startsWith('blob:')));

        if (hasGalleryChanged) {
            data.append('replace_gallery', 'true');
            for (const item of galleryItems.value) {
                if (item.file) {
                    data.append('new_gallery', item.file);
                } else {
                    const blob = await urlToBlob(item.url);
                    const fileName = item.url.substring(item.url.lastIndexOf('/') + 1);
                    data.append('new_gallery', blob, fileName);
                }
            }
        } else {
            data.append('replace_gallery', 'false');
        }
    }

    await shopStore.submitShop(data);
}

const closeFormModal = () => {
    shopStore.isFormModalOpen = false;
};
</script>
