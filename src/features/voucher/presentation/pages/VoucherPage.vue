<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-5">
      <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
        Voucher
      </h1>
      <button @click="voucherStore.openFormModal()" class="btn bg-violet-500 hover:bg-violet-600 text-white">
        <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
          <path
            d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
        <span class="hidden xs:block ml-2">Tambah Voucher</span>
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 relative">
      <header class="px-5 py-4">
        <div class="relative">
          <input v-model="localSearchQuery" type="search" class="form-input w-full pl-9"
            placeholder="Cari berdasarkan kode voucher..." />
          <div class="absolute inset-0 right-auto flex items-center pointer-events-none">
            <svg class="w-4 h-4 fill-current text-gray-400 dark:text-gray-500 ml-3" viewBox="0 0 16 16">
              <path
                d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
              <path
                d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
            </svg>
          </div>
        </div>
      </header>
      <div class="overflow-x-auto">
        <table class="table-auto w-full dark:text-gray-300">
          <thead
            class="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th v-for="header in headerGroup.headers" :key="header.id" class="p-2 whitespace-nowrap text-center">
                <div class="font-semibold">
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
            <tr v-if="isLoading && voucherList.length === 0">
              <td :colspan="columns.length" class="p-4 text-center">
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="table.getRowModel().rows.length === 0">
              <td :colspan="columns.length" class="p-4 text-center">
                Data tidak ditemukan.
              </td>
            </tr>
            <tr v-for="row in table.getRowModel().rows" :key="row.id"
              class="hover:bg-gray-100 dark:hover:bg-gray-900/20">
              <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-2 whitespace-nowrap text-center">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4">
        <Pagination :pagination="pagination" :isLoading="isLoading" @change-page="voucherStore.changePage" />
      </div>
    </div>

    <VoucherFormModal />
    <BaseModal :isOpen="isDeleteModalOpen" :loading="isLoading" @close="isDeleteModalOpen = false"
      @confirm="confirmDelete">
      <template #header>
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
          Hapus Voucher
        </DialogTitle>
      </template>
      <template #body>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat
          diurungkan.
        </p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, h } from "vue";
import { useVoucherStore } from "@/features/voucher/presentation/stores/useVoucherStore";
import { storeToRefs } from "pinia";
import { useVueTable, getCoreRowModel, FlexRender } from "@tanstack/vue-table";
import VoucherFormModal from "./components/VoucherFormModal.vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import Pagination from "@/components/Pagination.vue";
import StatusDropdown from "@/components/StatusToggleDropdown.vue";

const voucherStore = useVoucherStore();
const { voucherList, isLoading, pagination, statusLoadingId } =
  storeToRefs(voucherStore);

const localSearchQuery = ref("");
let debounceTimer = null;
watch(localSearchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    voucherStore.fetchVouchers(1, newQuery);
  }, 500);
});

const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const columns = [
  {
    accessorKey: "code",
    header: "Kode Voucher",
    cell: ({ getValue }) =>
      h(
        "span",
        { class: "font-semibold text-gray-800 dark:text-gray-100" },
        getValue()
      ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ getValue }) => {
      // ✅ Ambil teks deskripsi dan bersihkan dari HTML
      const plainText = stripHtml(getValue());

      // ✅ Buat VNode dengan tooltip yang menampilkan HTML asli saat di-hover
      return h(
        "div",
        {
          class: "relative group flex justify-start", // Butuh group & relative untuk tooltip
        },
        [
          h("span", { class: "block max-w-[250px] truncate" }, plainText),
          h("div", {
            class:
              "absolute bottom-full left-0 mb-2 w-max max-w-sm p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg invisible group-hover:visible transition-opacity opacity-0 group-hover:opacity-100 z-10",
            innerHTML: getValue(), // Render HTML asli di dalam tooltip
          }),
        ]
      );
    },
    // cell: ({ getValue }) =>
    //   h("span", { class: "block max-w-xs truncate" }, getValue()),
  },
  {
    header: "Ketentuan", // ✅ 1. Header diganti menjadi 'Ketentuan'
    cell: ({ row }) => {
      const item = row.original;

      // ✅ 2. Format diskon
      const discountText =
        item.discountType === "percent"
          ? `${item.discountPercent}%`
          : `Rp ${item.discountAmount.toLocaleString("id-ID")}`;

      // ✅ 3. Buat deskripsi minimal belanja
      const minSpendText = `min. belanja Rp ${item.minimumSpend.toLocaleString(
        "id-ID"
      )}`;

      // ✅ 4. Gabungkan keduanya dalam satu cell dengan VNode
      return h("div", { class: "text-left" }, [
        h(
          "div",
          { class: "font-bold text-violet-600 dark:text-violet-400" },
          discountText
        ),
        h("div", { class: "text-xs text-gray-500" }, minSpendText),
      ]);
    },
  },
  {
    accessorKey: "pointCost",
    header: "Biaya Poin",
    cell: ({ getValue }) => {
      // ✅ 5. Tambahkan ikon dan format angka
      return h(
        "div",
        {
          class:
            "inline-flex items-center font-semibold text-yellow-600 dark:text-yellow-400",
        },
        [
          h("span", { class: "mr-1" }, "🔸"), // Ikon poin
          getValue().toLocaleString("id-ID"),
        ]
      );
    },
  },
  {
    accessorKey: "quota",
    header: "Kuota",
    cell: ({ row }) =>
      h("span", `${row.original.claimedCount} / ${row.original.quota}`),
  },
  {
    accessorKey: "endDate",
    header: "Berakhir Pada",
    cell: ({ getValue }) => {
      // ✅ 6. Format tanggal agar lebih mudah dibaca
      return h(
        "span",
        getValue().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      h(StatusDropdown, {
        item: row.original,
        isLoading: statusLoadingId.value === row.original.id,
        onToggle: () => voucherStore.toggleVoucherStatus(row.original),
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
            onClick: () => voucherStore.openFormModal(row.original.id),
            title: "Edit",
            class: "text-gray-400 hover:text-violet-500",
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
            onClick: () => openDeleteModal(row.original.id),
            title: "Hapus",
            class: "text-red-400 hover:text-red-500",
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
  data: voucherList,
  columns,
  getCoreRowModel: getCoreRowModel(),
});

// ✅ Tambahkan state dan fungsi untuk modal hapus
const isDeleteModalOpen = ref(false);
const itemToDeleteId = ref(null);

const openDeleteModal = (id) => {
  itemToDeleteId.value = id;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (itemToDeleteId.value) {
    await voucherStore.removeVoucher(itemToDeleteId.value);
  }
  isDeleteModalOpen.value = false;
};

onMounted(() => {
  voucherStore.fetchVouchers();
});
</script>
