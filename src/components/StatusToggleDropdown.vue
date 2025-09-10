<!-- statusToggleDropDown -->
<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton :class="buttonClass" :disabled="props.isLoading"
        class="inline-flex justify-center items-center w-32 rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-violet-500 disabled:opacity-75 disabled:cursor-not-allowed">
        <div v-if="props.isLoading" class="flex items-center justify-center w-full">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>
        <template v-else>
          <div class="flex justify-around items-center w-full">
            <span>{{ buttonText }}</span>
            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
          </div>
        </template>
      </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems
        class="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="py-1">
          <MenuItem v-if="!props.item.isActive" v-slot="{ active }">
          <a href="#" @click.prevent="emit('toggle')" :class="[
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            'block px-4 py-2 text-sm',
          ]">
            Aktif
          </a>
          </MenuItem>
          <MenuItem v-if="props.item.isActive" v-slot="{ active }">
          <a href="#" @click.prevent="emit('toggle')" :class="[
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            'block px-4 py-2 text-sm',
          ]">
            Tidak Aktif
          </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { computed } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

// Menerima 'item' generik yang memiliki properti 'isActive'
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  // ✅ 3. Terima prop 'isLoading'
  isLoading: {
    type: Boolean,
    default: false,
  },
});

// Memancarkan event 'toggle' saat ada aksi
const emit = defineEmits(["toggle"]);

const buttonText = computed(() =>
  props.item.isActive ? "Aktif" : "Tidak Aktif"
);

const buttonClass = computed(() => {
  return props.item.isActive
    ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-500/20"
    : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/20";
});
</script>
