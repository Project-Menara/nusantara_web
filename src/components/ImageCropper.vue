<template>
  <div>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Sesuaikan area potong pada gambar, lalu tekan "Potong".
    </p>
    <div class="cropper-container">
      <cropper
        ref="cropperRef"
        class="cropper"
        :src="props.src"
        :stencil-props="{
          aspectRatio: props.aspectRatio,
        }"
      />
    </div>
    <div class="flex justify-end space-x-3 mt-4">
      <button @click="cancel" type="button" class="btn border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
        Batal
      </button>
      <button @click="cropImage" type="button" class="btn bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] text-white">
        Potong
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// ✅ Import dari library baru
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  src: { type: String, required: true },
  aspectRatio: { type: Number, default: 1 },
});

const emit = defineEmits(['crop', 'cancel']);

// ✅ Menggunakan ref untuk mengakses metode komponen
const cropperRef = ref(null);

const cropImage = () => {
  if (!cropperRef.value) return;

  // ✅ Cara mengambil hasil crop di library baru
  const { canvas } = cropperRef.value.getResult();
  if (canvas) {
    canvas.toBlob((blob) => {
      emit('crop', blob);
    }, 'image/jpeg', 0.9);
  }
};

const cancel = () => {
  emit('cancel');
};
</script>

<style>
/* vue-advanced-cropper merekomendasikan untuk memberi batasan ukuran 
  pada container agar tidak memenuhi seluruh layar.
*/
/* .cropper-container {
  height: 50vh;
  max-height: 500px;
  width: 100%;
  background: #222;
  border-radius: 0.5rem;
  overflow: hidden;
} */
</style>