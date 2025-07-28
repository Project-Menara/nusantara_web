<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-5">
      <h1
        class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"
      >
        Banner
      </h1>
      <button class="btn bg-violet-500 hover:bg-violet-600 text-white">
        <svg
          class="w-4 h-4 fill-current opacity-50 shrink-0"
          viewBox="0 0 16 16"
        >
          <path
            d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"
          />
        </svg>
        <span class="hidden xs:block ml-2">Tambah Banner</span>
      </button>
    </div>

    <div
      class="bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 relative"
    >
      <header class="px-5 py-4">
        <div class="relative">
          <input
            type="search"
            v-model="filtering"
            class="form-input w-full pl-9"
            placeholder="Cari berdasarkan nama banner..."
          />
          <div
            class="absolute inset-0 right-auto flex items-center pointer-events-none"
          >
            <svg
              class="w-4 h-4 fill-current text-gray-400 dark:text-gray-500 shrink-0 ml-3 mr-2"
              viewBox="0 0 16 16"
            >
              <path
                d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z"
              />
              <path
                d="m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z"
              />
            </svg>
          </div>
        </div>
      </header>

      <div class="overflow-x-auto">
        <table class="table-auto w-full dark:text-gray-300">
          <thead
            class="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50"
          >
            <tr
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <th
                v-for="header in headerGroup.headers"
                :key="header.id"
                class="p-2 whitespace-nowrap"
                :class="{
                  'text-center':
                    header.column.id === 'photo' ||
                    header.column.id === 'isActive' ||
                    header.column.id === 'actions',
                  'text-left':
                    header.column.id === 'name' ||
                    header.column.id === 'description',
                }"
              >
                <div
                  class="font-semibold cursor-pointer"
                  :class="{
                    'text-center':
                      header.column.id === 'photo' ||
                      header.column.id === 'isActive' ||
                      header.column.id === 'actions',
                    'text-left':
                      header.column.id === 'name' ||
                      header.column.id === 'description',
                  }"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <span v-if="header.column.getIsSorted()">
                    {{ header.column.getIsSorted() === "asc" ? "🔼" : "🔽" }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody
            class="text-sm divide-y divide-gray-100 dark:divide-gray-700/60"
          >
            <tr v-if="bannerStore.isLoading">
              <td :colspan="columns.length" class="p-4 text-center">
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="table.getRowModel().rows.length === 0">
              <td :colspan="columns.length" class="p-4 text-center">
                Data tidak ditemukan.
              </td>
            </tr>
            <tr
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="p-3 whitespace-nowrap align-middle"
                :class="{
                  'text-center':
                    cell.column.id === 'photo' ||
                    cell.column.id === 'isActive' ||
                    cell.column.id === 'actions',
                  'text-left':
                    cell.column.id === 'name' ||
                    cell.column.id === 'description',
                }"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Halaman {{ table.getState().pagination.pageIndex + 1 }} dari
          {{ table.getPageCount() }}
        </span>
        <div class="flex space-x-2">
          <button
            @click="table.setPageIndex(0)"
            :disabled="!table.getCanPreviousPage()"
            class="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Awal
          </button>
          <button
            @click="table.previousPage()"
            :disabled="!table.getCanPreviousPage()"
            class="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <button
            @click="table.nextPage()"
            :disabled="!table.getCanNextPage()"
            class="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Berikutnya
          </button>
          <button
            @click="table.setPageIndex(table.getPageCount() - 1)"
            :disabled="!table.getCanNextPage()"
            class="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Akhir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from "vue";
import { useBannerStore } from "@/features/banner/presentation/stores/bannerStore";
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FlexRender,
} from "@tanstack/vue-table";

// 1. State & Store
const bannerStore = useBannerStore();
const filtering = ref("");
const sorting = ref([]);

// 2. Definisi Kolom Tabel
const columns = [
  {
    accessorKey: "photo",
    header: "Gambar",
    cell: ({ getValue }) =>
      h("div", { class: "flex justify-center" }, [
        h("img", {
          src: getValue(),
          class:
            "h-12 w-20 object-cover rounded border border-gray-200 dark:border-gray-600",
        }),
      ]),
  },
  {
    accessorKey: "name",
    header: "Nama Banner",
    cell: ({ getValue }) =>
      h(
        "div",
        { class: "font-medium text-gray-900 dark:text-gray-100" },
        getValue()
      ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ getValue }) =>
      h("div", { class: "max-w-xs" }, [
        h(
          "span",
          {
            class: "text-gray-600 dark:text-gray-300 line-clamp-2",
            title: getValue(),
          },
          getValue()
        ),
      ]),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ getValue }) => {
      const isActive = getValue();
      const styleClass = isActive
        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30"
        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600";
      return h("div", { class: "flex justify-center" }, [
        h(
          "span",
          {
            class: `px-3 py-1 rounded-full text-xs font-medium border ${styleClass}`,
          },
          isActive ? "Aktif" : "Tidak Aktif"
        ),
      ]);
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) =>
      h("div", { class: "flex justify-center items-center space-x-3" }, [
        h(
          "button",
          {
            class:
              "text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-medium text-sm transition-colors duration-200",
            onClick: () => handleEdit(row.original.id),
            title: "Edit Banner",
          },
          "Edit"
        ),
        h(
          "button",
          {
            class:
              "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm transition-colors duration-200",
            onClick: () => handleDelete(row.original.id),
            title: "Hapus Banner",
          },
          "Hapus"
        ),
      ]),
  },
];

// 3. Inisialisasi TanStack Table
const table = useVueTable({
  data: bannerStore.bannerList,
  columns,
  state: {
    get globalFilter() {
      return filtering.value;
    },
    get sorting() {
      return sorting.value;
    },
  },
  onGlobalFilterChange: (val) => {
    filtering.value = val;
  },
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === "function" ? updater(sorting.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

// 4. Logika Aksi
const handleEdit = (id) => {
  console.log("Edit banner with ID:", id);
  // Di sini Anda bisa membuka modal edit
};

const handleDelete = (id) => {
  console.log("Delete banner with ID:", id);
  // Di sini Anda bisa membuka modal konfirmasi hapus
};

// 5. Muat data awal
onMounted(() => {
  bannerStore.fetchBanners();
});
</script>
