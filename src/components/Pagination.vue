<template>
  <div
    v-if="pagination && pagination.totalPages > 1"
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
  >
    <div
      class="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left mb-4 sm:mb-0"
    >
      Menampilkan
      <span class="font-medium text-gray-700 dark:text-gray-200">{{
        startItem
      }}</span>
      -
      <span class="font-medium text-gray-700 dark:text-gray-200">{{
        endItem
      }}</span>
      dari
      <span class="font-medium text-gray-700 dark:text-gray-200">{{
        pagination.totalData
      }}</span>
      hasil
    </div>

    <nav>
      <ul class="inline-flex items-center space-x-2 text-sm">
        <li>
          <button
            @click="changePage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1 || isLoading"
            class="btn-page-nav"
          >
            Previous
          </button>
        </li>

        <li v-for="(page, index) in pages" :key="`page-${index}`">
          <span v-if="page === '...'" class="px-3 py-1.5 text-gray-500"
            >...</span
          >
          <button
            v-else
            @click="changePage(page)"
            :disabled="isLoading"
            :class="[
              'btn-page-num',
              page === pagination.currentPage
                ? 'bg-[var(--color-violet-600)] text-white'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            {{ page }}
          </button>
        </li>

        <li>
          <button
            @click="changePage(pagination.currentPage + 1)"
            :disabled="
              pagination.currentPage === pagination.totalPages || isLoading
            "
            class="btn-page-nav"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
// Bagian <script setup> Anda sudah benar dan tidak perlu diubah.
import { computed } from "vue";

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["change-page"]);

const changePage = (page) => {
  if (typeof page !== "number" || props.isLoading) return;
  emit("change-page", page);
};

const startItem = computed(
  () => (props.pagination.currentPage - 1) * props.pagination.perPage + 1
);
const endItem = computed(() =>
  Math.min(
    props.pagination.currentPage * props.pagination.perPage,
    props.pagination.totalData
  )
);

const pages = computed(() => {
  if (!props.pagination) return [];
  const total = props.pagination.totalPages;
  const current = props.pagination.currentPage;
  const range = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }
    return range;
  }
  if (current < 4) {
    return [1, 2, 3, "...", total];
  }
  if (current > total - 3) {
    return [1, "...", total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
});
</script>
