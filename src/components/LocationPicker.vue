<template>
    <div class="space-y-4">
        <div>
            <label for="location-search" class="block text-sm font-medium mb-1">Cari Alamat atau Nama Tempat</label>
            <input id="location-search" ref="autocompleteInput" type="text" class="form-input w-full"
                placeholder="Contoh: Istana Maimun, Medan" />
        </div>

        <div ref="mapCanvas" class="w-full h-96 bg-gray-200 dark:bg-gray-900/50 rounded-md shadow-md">
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-md space-y-2">
            <h4 class="font-bold text-lg">Lokasi Terpilih:</h4>
            <div class="text-sm">
                <strong>Latitude:</strong> <span>{{ lat }}</span>
            </div>
            <div class="text-sm">
                <strong>Longitude:</strong> <span>{{ lng }}</span>
            </div>
            <div class="text-sm">
                <strong>Alamat:</strong> <span class="text-gray-600 dark:text-gray-300">{{ address }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// ✅ MENERIMA PROPS DARI INDUK
const props = defineProps({
    lat: Number,
    lng: Number,
    address: String,
    initMap: Function, // Menerima fungsi inisialisasi dari luar
});

// Ref untuk elemen-elemen di template
const autocompleteInput = ref(null);
const mapCanvas = ref(null);

// Panggil initMap (dari props) setelah komponen ter-mount di DOM
onMounted(() => {
    // 2. Gunakan nextTick untuk memastikan DOM siap
    nextTick(() => {
        // 3. Tambahkan pengecekan untuk memastikan elemen tidak null
        if (mapCanvas.value && autocompleteInput.value && props.initMap) {
            props.initMap(mapCanvas.value, autocompleteInput.value);
        } else {
            console.error("Elemen peta atau fungsi initMap belum siap.");
        }
    });
});
</script>