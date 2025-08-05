<!-- BannerPage -->
<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-5">
      <h1
        class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"
      >
        Banner
      </h1>
      <button
        @click="bannerStore.openFormModal()"
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
            v-model="localSearchQuery"
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
                class="p-2 whitespace-nowrap text-center"
              >
                <div
                  class="font-semibold"
                  :class="
                    header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : ''
                  "
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <span v-if="header.column.getIsSorted()">{{
                    header.column.getIsSorted() === "asc" ? "🔼" : "🔽"
                  }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody
            class="text-sm divide-y divide-gray-100 dark:divide-gray-700/60"
          >
            <tr v-if="isLoading && bannerList.length === 0">
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
                class="p-2 whitespace-nowrap text-center"
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
          @change-page="bannerStore.changePage"
        />
      </div>
    </div>

    <BannerFormModal />

    <BaseModal
      :isOpen="isDeleteModalOpen"
      :loading="isLoading"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    >
      <template #header>
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          Hapus Banner
        </DialogTitle>
      </template>
      <template #body>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus banner ini? Tindakan ini tidak dapat
          diurungkan.
        </p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, h } from "vue";
import { useBannerStore } from "@/features/banner/presentation/stores/bannerStore";
import { useUiStore } from "@/stores/uiStore";
import { storeToRefs } from "pinia";
import { useVueTable, getCoreRowModel, FlexRender } from "@tanstack/vue-table";
import BannerFormModal from "./components/BannerFormModal.vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import Pagination from "@/components/Pagination.vue";
import StatusDropdown from "@/components/StatusToggleDropdown.vue";
import { DialogTitle } from "@headlessui/vue";

const bannerStore = useBannerStore();
const uiStore = useUiStore();
const { bannerList, isLoading, pagination, statusLoadingId } =
  storeToRefs(bannerStore);

const isDeleteModalOpen = ref(false);
const bannerIdToDelete = ref(null);

// ✅ TAMBAHKAN LOGIKA DEBOUNCING BARU
const localSearchQuery = ref("");
let debounceTimer = null;

watch(localSearchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    bannerStore.fetchBanners(1, newQuery);
  }, 300);
});

const columns = [
  {
    accessorKey: "photo",
    header: "Gambar",
    cell: ({ row }) => {
      // ✅ 3. Buat gambar bisa diklik
      return h(
        "div",
        {
          class: "flex justify-center cursor-pointer",
          onClick: () =>
            uiStore.openImageModal({
              src: row.original.photo,
              title: row.original.name,
            }),
        },
        [
          h("img", {
            src: row.original.photo,
            class: "h-10 w-20 object-cover rounded mx-auto",
            loading: "lazy",
            alt: "Banner",
          }),
        ]
      );
    },
  },
  { accessorKey: "name", header: "Nama Banner" },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ getValue }) =>
      h(
        "span",
        { class: "block max-w-xs truncate mx-auto text-left" },
        getValue()
      ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    // ✅ Ubah 'banner' menjadi 'item' agar komponen StatusDropdown bisa dipakai ulang
    // ✅ Teruskan prop 'isLoading'
    cell: ({ row }) =>
      h(StatusDropdown, {
        item: row.original,
        isLoading: statusLoadingId.value === row.original.id,
        onToggle: () => bannerStore.toggleBannerStatus(row.original),
      }),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) =>
      h("div", { class: "flex justify-center items-center space-x-4" }, [
        h(
          "button",
          {
            class: "text-gray-400 hover:text-violet-500",
            title: "Edit",
            onClick: () => bannerStore.openFormModal(row.original.id),
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
          "button",
          {
            class: "text-red-400 hover:text-red-500",
            title: "Hapus",
            onClick: () => openDeleteModal(row.original.id),
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
  data: bannerList,
  columns,
  getCoreRowModel: getCoreRowModel(),
});

const openDeleteModal = (id) => {
  bannerIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};
const confirmDelete = async () => {
  if (bannerIdToDelete.value) {
    await bannerStore.removeBanner(bannerIdToDelete.value);
  }
  isDeleteModalOpen.value = false;
};

onMounted(() => {
  bannerStore.fetchBanners();
});
</script>
