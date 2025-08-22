<template>
  <div
    v-if="editor"
    class="border border-gray-300 dark:border-gray-600 rounded-md"
  >
    <div
      class="flex flex-wrap items-center gap-2 p-2 border-b border-gray-300 dark:border-gray-600"
    >
      <button
        @click="editor.chain().focus().toggleBold().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="editor-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M13.5 15.5H10V12.5H13.5C14.33 12.5 15 13.17 15 14C15 14.83 14.33 15.5 13.5 15.5M10 6.5H13a2.5 2.5 0 0 1 0 5H10V6.5M15.6 10.77C16.5 10.27 17 9.42 17 8.5C17 6.57 15.43 5 13.5 5H8.5v12H14a3.5 3.5 0 0 0 0-7c.53.04 1.05.27 1.5.63l.1-.13Z"
          />
        </svg>
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('italic') }"
        class="editor-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4Z"
          />
        </svg>
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="editor-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7 5h14v2H7V5m0 6h14v2H7v-2m0 6h14v2H7v-2M3 4.5A1.5 1.5 0 0 1 4.5 3A1.5 1.5 0 0 1 6 4.5A1.5 1.5 0 0 1 4.5 6A1.5 1.5 0 0 1 3 4.5m0 6A1.5 1.5 0 0 1 4.5 9a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5A1.5 1.5 0 0 1 3 10.5m0 6A1.5 1.5 0 0 1 4.5 15a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5A1.5 1.5 0 0 1 3 16.5"
          />
        </svg>
      </button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { watch } from "vue"; // Import watch secara eksplisit

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  // ✅ Gunakan || '' untuk memastikan konten tidak pernah null/undefined saat inisialisasi
  content: props.modelValue || "",
  extensions: [StarterKit],
  onUpdate: () => {
    // Jika editor kosong, kirim string kosong, bukan <p></p>
    const html = editor.value.isEmpty ? "" : editor.value.getHTML();
    emit("update:modelValue", html);
  },
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none p-3 min-h-[120px]",
    },
  },
});

watch(
  () => props.modelValue,
  (value) => {
    // ✅ Gunakan || '' lagi untuk keamanan
    const editorHTML = editor.value.isEmpty ? "" : editor.value.getHTML();
    const propValue = value || "";

    if (editorHTML === propValue) return;

    editor.value.commands.setContent(propValue, false);
  }
);

// ✅ Tambahan: Hancurkan instance editor saat komponen dilepas untuk mencegah memory leak
import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style>
/* Styling untuk Tiptap Editor */
.prose {
  max-width: none;
}
.editor-btn {
  @apply p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700;
}
.editor-btn.is-active {
  @apply bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400;
}

/* Kustomisasi Tiptap Content Area */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
