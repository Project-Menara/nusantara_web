<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
        Tambah Toko Baru
      </h1>
      <p class="text-gray-500 mt-1">Gunakan peta di bawah untuk menentukan lokasi toko Anda secara akurat.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 shadow-lg rounded-md p-6 space-y-6">
      
      <div>
        <label for="store-name" class="block text-sm font-medium mb-1">Nama Toko</label>
        <input v-model="storeData.name" id="store-name" type="text" class="form-input w-full" placeholder="Contoh: Nusantara Oleh-Oleh Cabang Medan" required />
      </div>

      <div>
        <label for="store-address" class="block text-sm font-medium mb-1">Alamat Lengkap</label>
        <textarea v-model="storeData.fullAddress" id="store-address" rows="3" class="form-textarea w-full" placeholder="Alamat akan terisi otomatis dari peta..."></textarea>
      </div>

      <LocationPicker 
        :lat="lat"
        :lng="lng"
        :address="address"
        :initMap="initMap"
      />

      <div class="flex justify-end">
        <button type="submit" class="btn bg-violet-500 hover:bg-violet-600 text-white">
          Simpan Toko
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import LocationPicker from '@/components/LocationPicker.vue'; // Impor komponen peta
import { useGoogleMaps } from '@/composables/useGoogleMaps'; // Impor composable peta

// ✅ LOGIKA UTAMA ADA DI SINI (DI HALAMAN INDUK)

// 1. Gunakan composable untuk mendapatkan state dan fungsi peta
const { lat, lng, address, initMap } = useGoogleMaps();

// 2. Buat state untuk data form toko itu sendiri
const storeData = ref({
  name: '',
  fullAddress: '',
});

// 3. Sinkronkan alamat dari peta ke form toko
// Setiap kali 'address' dari peta berubah, update 'storeData.fullAddress'
watch(address, (newAddress) => {
  storeData.value.fullAddress = newAddress;
});

// 4. Fungsi untuk submit
const handleSubmit = () => {
  // Gabungkan semua data yang dibutuhkan
  const payload = {
    ...storeData.value,
    latitude: lat.value,
    longitude: lng.value,
  };
  
  // Di sini Anda akan memanggil store untuk menyimpan data
  console.log("Data Siap Dikirim ke Backend:", payload);
  alert("Data Toko Siap Disimpan! Cek console log untuk melihat payload.");
  
  // Contoh: await storeToko.createStore(payload);
};
</script>