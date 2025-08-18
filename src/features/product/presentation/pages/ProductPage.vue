<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-5">
      <h1
        class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"
      >
        Produk
      </h1>
      <button
        @click="productStore.openFormModal()"
        class="btn bg-violet-500 hover:bg-violet-600 text-white"
      >
        <svg
          class="w-4 h-4 fill-current opacity-50 shrink-0"
          viewBox="0 0 16 16"
        >
          <path
            d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"
          />
        </svg>
        <span class="hidden xs:block ml-2">Tambah Produk</span>
      </button>
    </div>
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-sm ...">
      <header class="px-5 py-4">
        <div class="relative">
          <input
            v-model="localSearchQuery"
            type="search"
            class="form-input w-full pl-9"
            placeholder="Cari berdasarkan nama produk..."
          />
          <div
            class="absolute inset-0 right-auto flex items-center pointer-events-none"
          >
            <svg
              class="w-4 h-4 fill-current text-gray-400 dark:text-gray-500 ml-3"
              viewBox="0 0 16 16"
            >
              <path
                d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
              />
              <path
                d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"
              />
            </svg>
          </div>
        </div>
      </header>
      <div class="overflow-x-auto">
        <table class="table-auto w-full dark:text-gray-300">
          <thead class="text-xs font-semibold uppercase ...">
            <tr
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <th
                v-for="header in headerGroup.headers"
                :key="header.id"
                class="p-2 ..."
              >
                <div class="font-semibold">
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y ...">
            <tr v-if="isLoading && productList.length === 0">
              <td :colspan="columns.length" class="p-4 text-center">
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="table.getRowModel().rows.length === 0">
              <td :colspan="columns.length" class="p-4 text-center">
                Data tidak ditemukan.
              </td>
            </tr>
            <tr v-for="row in table.getRowModel().rows" :key="row.id">
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="p-2 ..."
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
      <div class="p-4">
        <Pagination
          :pagination="pagination"
          :isLoading="isLoading"
          @change-page="productStore.changePage"
        />
      </div>
    </div>
    <ProductFormModal />
    <BaseModal
      :isOpen="isDeleteModalOpen"
      :loading="isLoading"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    >
      <template #header>
        <DialogTitle as="h3" class="text-lg font-medium ..."
          >Hapus Produk</DialogTitle
        >
      </template>
      <template #body>
        <p class="text-sm text-gray-500 ...">
          Apakah Anda yakin ingin menghapus produk ini?
        </p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, h } from "vue";
import { useProductStore } from "../stores/useProductStore";
import { useUiStore } from "@/stores/uiStore";
import { storeToRefs } from "pinia";
import { useVueTable, getCoreRowModel, FlexRender } from "@tanstack/vue-table";
import Pagination from "@/components/Pagination.vue";
import ProductFormModal from "./components/ProductFormModal.vue"; // ✅ Import form modal
import BaseModal from "@/components/modals/BaseModal.vue"; // ✅ Import base modal
import { DialogTitle } from "@headlessui/vue"; // ✅ Import DialogTitle

const productStore = useProductStore();
const uiStore = useUiStore();
const { productList, isLoading, pagination } = storeToRefs(productStore);

// ✅ State untuk modal hapus
const isDeleteModalOpen = ref(false);
const itemToDeleteId = ref(null);

const localSearchQuery = ref("");
let debounceTimer = null;
watch(localSearchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    productStore.fetchProducts(1, newQuery);
  }, 500);
});

const columns = [
  {
    accessorKey: "coverImage",
    header: "Gambar",
    cell: ({ row }) =>
      h("img", {
        src: row.original.coverImage,
        class:
          "h-12 w-12 object-cover rounded-md mx-auto cursor-pointer shadow-lg",
        onClick: () =>
          uiStore.openImageModal({
            src: row.original.coverImage,
            title: row.original.name,
          }),
      }),
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-left font-semibold text-gray-800 dark:text-gray-100" },
        row.original.name
      ),
  },
  { accessorKey: "code", header: "Code" },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ getValue }) => `Rp${getValue().toLocaleString("id-ID")}`,
  },
  { accessorKey: "unit", header: "Unit" },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) =>
      h("span", { class: "block max-w-xs truncate text-left" }, getValue()),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) =>
      h("div", { class: "flex justify-center items-center space-x-2" }, [
        h(
          // Tombol Edit
          "button",
          {
            // ✅ Hubungkan ke openFormModal di store
            onClick: () => productStore.openFormModal(row.original.id),
            title: "Edit",
            class:
              "p-1 rounded-md text-gray-400 hover:text-violet-500 hover:bg-gray-100 dark:hover:bg-gray-700",
          },
          [
            h(
              "svg",
              { class: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor" },
              [
                h("path", {
                  d: "M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z",
                }),
                h("path", {
                  "fill-rule": "evenodd",
                  d: "M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z",
                  "clip-rule": "evenodd",
                }),
              ]
            ),
          ]
        ),
        h(
          // Tombol Hapus
          "button",
          {
            // ✅ Hubungkan ke openDeleteModal lokal
            onClick: () => openDeleteModal(row.original.id),
            title: "Hapus",
            class:
              "p-1 rounded-md text-red-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700",
          },
          [
            h(
              "svg",
              { class: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor" },
              [
                h("path", {
                  "fill-rule": "evenodd",
                  d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z",
                  "clip-rule": "evenodd",
                }),
              ]
            ),
          ]
        ),
      ]),
  },
];

const table = useVueTable({
  data: productList,
  columns,
  getCoreRowModel: getCoreRowModel(),
});

// ✅ Tambahkan fungsi untuk modal hapus
const openDeleteModal = (id) => {
  itemToDeleteId.value = id;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (itemToDeleteId.value) {
    await productStore.removeProduct(itemToDeleteId.value);
  }
  isDeleteModalOpen.value = false;
};

onMounted(() => {
  productStore.fetchProducts();
});
</script>
