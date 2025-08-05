<template>
  <router-view />

  <ImagePreviewModal />
  <GlobalResponseModal />
</template>

<script setup>
import "./charts/ChartjsConfig";
import GlobalResponseModal from "./components/modals/GlobalResponseModal.vue";
import ImagePreviewModal from "./components/modals/imagePreviewModal.vue";
</script>
