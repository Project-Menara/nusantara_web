// File: src/composables/useGoogleMaps.js

import { ref } from 'vue';

export function useGoogleMaps() {
  // --- State Reaktif ---
  // Ini adalah data yang akan kita kirim kembali ke komponen
  const lat = ref(-6.2088); // Default: Jakarta
  const lng = ref(106.8456);
  const address = ref('');

  let map = null;
  let marker = null;
  let geocoder = null;

  // --- Fungsi Utama untuk Inisialisasi ---
  const initMap = (mapElement, autocompleteElement) => {
    // 1. Buat Peta
    map = new google.maps.Map(mapElement, {
      center: { lat: lat.value, lng: lng.value },
      zoom: 12,
    });

    // 2. Buat Geocoder untuk Reverse Geocoding
    geocoder = new google.maps.Geocoder();

    // 3. Buat Marker Awal
    marker = new google.maps.Marker({
      position: { lat: lat.value, lng: lng.value },
      map: map,
      draggable: true, // Marker bisa digeser
    });

    // 4. Setup Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(autocompleteElement, {
      fields: ["geometry", "name", "formatted_address"],
    });

    // --- Event Listeners ---

    // 5. Saat Pengguna Memilih Lokasi dari Autocomplete
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        
        // Update state reaktif
        lat.value = location.lat();
        lng.value = location.lng();
        address.value = place.formatted_address;

        // Pindahkan peta dan marker ke lokasi baru
        map.setCenter(location);
        marker.setPosition(location);
      }
    });

    // 6. Saat Pengguna Selesai Menggeser Marker
    marker.addListener('dragend', (event) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      
      // Update state reaktif
      lat.value = newLat;
      lng.value = newLng;

      // Lakukan Reverse Geocoding untuk mendapatkan alamat dari koordinat baru
      geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          address.value = results[0].formatted_address;
        } else {
          address.value = 'Alamat tidak ditemukan';
        }
      });
    });
  };

  // Kembalikan state dan fungsi agar bisa dipakai komponen
  return {
    lat,
    lng,
    address,
    initMap,
  };
}