<template>
    <div class="space-y-4">
        <div>
            <label for="location-search" class="block text-sm font-medium mb-1">Cari Alamat atau Nama Tempat</label>
            <input id="location-search" ref="autocompleteInput" type="text" class="form-input w-full"
                placeholder="Contoh: Istana Maimun, Medan" />
        </div>

        <div ref="mapCanvas" class="w-full h-96 bg-gray-200 dark:bg-gray-900/50 rounded-md shadow-md">
        </div>


        <div
            class="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-3 bg-white dark:bg-gray-800">
            <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-violet-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 class="font-bold text-lg text-gray-900 dark:text-white">Lokasi Terpilih</h4>
            </div>

            <div class="pl-9">
                <p class="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">{{ address || "Geser pin dipetauntuk memilih alamat." }}</p>

                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Latitude: {{ lat.toFixed(4) }}, Longitude: {{ lng.toFixed(4) }}
                </p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const props = defineProps({
    lat: Number,
    lng: Number,
    address: String,
    initMap: Function,
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