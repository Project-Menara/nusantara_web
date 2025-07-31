<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        :class="buttonClass"
        class="inline-flex justify-center w-28 rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-violet-500"
      >
        <span>{{ buttonText }}</span>
        <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              @click.prevent="updateStatus(true)"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
            >
              Aktif
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              @click.prevent="updateStatus(false)"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
            >
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
import { useBannerStore } from "@/features/banner/presentation/stores/bannerStore";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  banner: {
    type: Object,
    required: true,
  },
});

const bannerStore = useBannerStore();

const buttonText = computed(() =>
  props.banner.isActive ? "Aktif" : "Tidak Aktif"
);

const buttonClass = computed(() => {
  return props.banner.isActive
    ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-500/20"
    : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/20";
});

const updateStatus = (newStatus) => {
  if (props.banner.isActive !== newStatus) {
    bannerStore.toggleBannerStatus(props.banner);
  }
};
</script>
