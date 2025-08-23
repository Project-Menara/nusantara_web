// src/composables/useCurrencyFormatter.js

import { computed } from 'vue';

// Composable function kita.
// Ia menerima 'formState' sebagai argumen, yang merupakan 'ref' dari data form kita (seperti formData).
export function useCurrencyFormatter(formState) {

  // Kita pindahkan fungsi handleCurrencyInput ke sini.
  // Perhatikan perubahannya dari `formData.value` menjadi `formState.value`.
  const handleCurrencyInput = (event, fieldName) => {
    const rawValue = event.target.value;
    const newNumber = Number(String(rawValue).replace(/[^0-9]/g, ""));
    
    // Sekarang ia akan mengubah state yang diberikan padanya, bukan 'formData' secara spesifik.
    formState.value[fieldName] = newNumber;

    event.target.value = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(newNumber);
  };

  // Kita juga pindahkan fungsi createCurrencyComputed ke sini.
  // Perubahannya juga sama, dari `formData.value` menjadi `formState.value`.
  const createCurrencyComputed = (fieldName) => {
    return computed(() => {
      // Pastikan formState dan fieldName ada sebelum diakses
      const numberValue = formState.value?.[fieldName] || 0;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(numberValue);
    });
  };

  // "Keluarkan" kedua fungsi tersebut dari ransel agar bisa digunakan oleh komponen.
  return {
    handleCurrencyInput,
    createCurrencyComputed,
  };
}