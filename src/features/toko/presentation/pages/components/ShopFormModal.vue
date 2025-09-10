<template>
  <BaseModal :isOpen="shopStore.isFormModalOpen" @close="closeFormModal" size="4xl">
    <template #header>
      <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
        {{ isEditMode ? "Edit Toko" : "Tambah Toko" }}
      </DialogTitle>
    </template>
    
    <template #body>
      <div class="relative">
        <!-- Loading Overlay -->
        <div v-if="shopStore.isFormLoading || isFetchingRelatedData"
          class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-20 rounded-lg">
          <svg class="animate-spin h-8 w-8 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
          <!-- Shop Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium mb-1">Nama Toko</label>
              <input v-model="formData.name" type="text" id="name" class="form-input w-full" required />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium mb-1">Deskripsi</label>
              <input v-model="formData.description" type="text" id="description" class="form-input w-full" required />
            </div>
          </div>

          <!-- Location Picker -->
          <div>
            <h4 class="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100">Lokasi Toko</h4>
            <LocationPicker :lat="lat" :lng="lng" :address="address" :initMap="initMap" />
          </div>

          <!-- Cashier Selection -->
          <div>
            <label class="block text-sm font-medium mb-1">Pilih Kasir</label>
            <div class="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                <label v-for="cashier in cashierList" :key="cashier.id" class="flex items-center space-x-2">
                    <input type="checkbox" :value="cashier.id" v-model="selectedCashiers" class="form-checkbox" />
                    <span>{{ cashier.name }}</span>
                </label>
            </div>
          </div>
          
          <!-- Product Selection -->
          <div>
            <label class="block text-sm font-medium mb-1">Tambah Produk ke Toko</label>
            <input type="search" v-model="productSearch" placeholder="Cari produk untuk ditambahkan..." class="form-input w-full mb-2"/>
            <div v-if="productSearch && filteredProducts.length" class="max-h-40 overflow-y-auto border rounded-md">
                <div v-for="product in filteredProducts" :key="product.id" @click="addProductToShop(product)" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {{ product.name }}
                </div>
            </div>
            <!-- Selected Products Table -->
            <div v-if="selectedProducts.length" class="mt-4">
                <h5 class="font-semibold mb-2">Produk Terpilih:</h5>
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead class="text-xs text-left">
                            <tr>
                                <th class="p-2">Nama</th>
                                <th class="p-2">Stok</th>
                                <th class="p-2">Harga (Opsional)</th>
                                <th class="p-2">Status</th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(prod, index) in selectedProducts" :key="prod.id">
                                <td class="p-1">{{ prod.name }}</td>
                                <td class="p-1"><input type="number" v-model.number="prod.stock" class="form-input w-24" placeholder="Stok" required /></td>
                                <td class="p-1"><input type="number" v-model.number="prod.price" class="form-input w-32" placeholder="Harga Toko" /></td>
                                <td class="p-1">
                                    <select v-model.number="prod.status" class="form-select w-28">
                                        <option :value="1">Aktif</option>
                                        <option :value="0">Nonaktif</option>
                                    </select>
                                </td>
                                <td class="p-1">
                                    <button @click="removeProductFromShop(index)" type="button" class="text-red-500">&times;</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>

          <!-- File Uploads -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Cover Upload -->
              <div>
                <label class="block text-sm font-medium mb-1">Gambar Utama (Cover)</label>
                <input @change="handleFileChange($event, 'cover')" type="file" class="form-input w-full" accept="image/*" />
                <img v-if="coverPreview" :src="coverPreview" class="h-24 w-24 mt-2 object-cover rounded-md shadow-lg" />
              </div>
              <!-- Gallery Upload -->
              <div>
                <label class="block text-sm font-medium mb-1">Galeri Gambar</label>
                <input @change="handleFileChange($event, 'gallery')" type="file" multiple class="form-input w-full" accept="image/*" />
                <div v-if="galleryPreviews.length" class="mt-2 flex flex-wrap gap-2">
                    <div v-for="(url, index) in galleryPreviews" :key="index" class="relative">
                        <img :src="url" class="h-24 w-24 object-cover rounded-md shadow-lg" />
                        <button @click="removeGalleryImage(index)" type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6">&times;</button>
                    </div>
                </div>
              </div>
          </div>

        </form>
      </div>
    </template>
    
    <template #footer>
      <button @click="closeFormModal" type="button" class="btn border-gray-300 dark:border-gray-600">Batal</button>
      <button @click="handleSubmit" :disabled="shopStore.isFormLoading" class="btn bg-violet-500 hover:bg-violet-600 text-white">
        <span v-if="shopStore.isFormLoading">Menyimpan...</span>
        <span v-else>{{ isEditMode ? "Simpan Perubahan" : "Tambah Toko" }}</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useShopStore } from "../../stores/useShopStore";
import { useCashierStore } from "@/features/cashier/presentation/stores/useCashierStore";
import { useProductStore } from "@/features/product/presentation/stores/useProductStore";
import { storeToRefs } from "pinia";
import BaseModal from "@/components/modals/BaseModal.vue";
import LocationPicker from '@/components/LocationPicker.vue';
import { useGoogleMaps } from '@/composables/useGoogleMaps';
import { DialogTitle } from "@headlessui/vue";

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
const selectedCashiers = ref([]);
const selectedProducts = ref([]);
const productSearch = ref('');
const isFetchingRelatedData = ref(false);

const coverFile = ref(null);
const coverPreview = ref('');
const galleryFiles = ref([]);
const galleryPreviews = ref([]);

// --- Google Maps ---
const { lat, lng, address, initMap } = useGoogleMaps();

// --- Computed ---
const filteredProducts = computed(() => {
    if (!productSearch.value) return [];
    return productList.value.filter(p => 
        p.name.toLowerCase().includes(productSearch.value.toLowerCase()) &&
        !selectedProducts.value.some(sp => sp.id === p.id)
    );
});

// --- Watchers ---
watch(selectedShop, (newShop) => {
    if (newShop) { // Edit Mode
        formData.value = {
            name: newShop.name,
            description: newShop.description,
        };
        lat.value = newShop.lat;
        lng.value = newShop.lng;
        address.value = newShop.fullAddress;
        selectedCashiers.value = newShop.cashiers.map(c => c.id);
        selectedProducts.value = newShop.products.map(p => ({
            id: p.id,
            name: p.name,
            stock: p.stock || 0, // Fallback if stock is not available
            price: p.price || null,
            status: p.isActive ? 1 : 0,
        }));
        coverPreview.value = newShop.cover;
        galleryPreviews.value = [...newShop.gallery];
    } else { // Create Mode
        resetForm();
    }
});

watch(() => shopStore.isFormModalOpen, (isOpen) => {
    if (isOpen) {
        fetchRelatedData();
        if (!isEditMode.value) {
            resetForm();
        }
    }
});

// --- Methods ---
function resetForm() {
    formData.value = { name: '', description: '' };
    lat.value = -6.2088; // Jakarta
    lng.value = 106.8456;
    address.value = '';
    selectedCashiers.value = [];
    selectedProducts.value = [];
    coverFile.value = null;
    coverPreview.value = '';
    galleryFiles.value = [];
    galleryPreviews.value = [];
}

async function fetchRelatedData() {
    isFetchingRelatedData.value = true;
    // Fetch all data without pagination for selection
    await Promise.all([
        cashierStore.fetchCashiers(1, '', true), // Assuming fetchCashiers can fetch all
        productStore.fetchProducts(1, '', true)   // Assuming fetchProducts can fetch all
    ]);
    isFetchingRelatedData.value = false;
}

function handleFileChange(event, type) {
    if (type === 'cover') {
        const file = event.target.files[0];
        if (!file) return;
        coverFile.value = file;
        coverPreview.value = URL.createObjectURL(file);
    } else { // gallery
        const files = event.target.files;
        for (const file of files) {
            galleryFiles.value.push(file);
            galleryPreviews.value.push(URL.createObjectURL(file));
        }
    }
}

function removeGalleryImage(index) {
    galleryFiles.value.splice(index, 1);
    galleryPreviews.value.splice(index, 1);
}

function addProductToShop(product) {
    selectedProducts.value.push({
        id: product.id,
        name: product.name,
        stock: 0,
        price: null, // User can override
        status: 1,   // Default to active
    });
    productSearch.value = '';
}

function removeProductFromShop(index) {
    selectedProducts.value.splice(index, 1);
}

async function handleSubmit() {
    const data = new FormData();

    // Append standard fields
    data.append('name', formData.value.name);
    data.append('description', formData.value.description);
    data.append('full_address', address.value);
    data.append('lat', lat.value);
    data.append('lang', lng.value);
    
    // Append JSON stringified arrays
    data.append('cashier_ids', JSON.stringify(selectedCashiers.value));
    const productsPayload = selectedProducts.value.map(p => ({
        product_id: p.id,
        stock: p.stock,
        ...(p.price && { price: p.price }), // only include price if it's set
        status: p.status,
    }));
    data.append('products', JSON.stringify(productsPayload));
    
    // Append files
    if (!isEditMode.value) { // Create mode
        data.append('status', 1);
        if (coverFile.value) data.append('cover', coverFile.value);
        galleryFiles.value.forEach(file => data.append('gallery', file));
    } else { // Edit mode
        if (coverFile.value) data.append('new_cover', coverFile.value);
        if (galleryFiles.value.length > 0) {
            data.append('replace_gallery', 'true');
            // Logic to handle existing vs new gallery images will be complex
            // For now, this replaces all.
            galleryFiles.value.forEach(file => data.append('new_gallery', file));
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
