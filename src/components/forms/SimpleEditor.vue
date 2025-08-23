<template>
  <div
    v-if="editor"
    class="border border-gray-300 dark:border-gray-600 rounded-md"
  >
    <div
      class="flex flex-wrap items-center gap-x-2 p-2 border-b border-gray-300 dark:border-gray-600"
    >
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        type="button"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        class="editor-btn font-bold"
      >
        H2
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        type="button"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        class="editor-btn font-bold"
      >
        H3
      </button>

      <div class="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
      <button
        @click="editor.chain().focus().toggleBold().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="editor-btn"
        title="Bold"
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
        title="Italic"
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
        @click="editor.chain().focus().toggleUnderline().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('underline') }"
        class="editor-btn"
        title="Underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5 21h14v-2H5v2M12 17q1.25 0 2.125-.875T15 14V3H9v11q0 1.25.875 2.125T12 17"
          />
        </svg>
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('strike') }"
        class="editor-btn"
        title="Strikethrough"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 14h18v-2H3v2m10.1-4.72L15 6.47V5H9v1.5l2.2.85l-2.9 3.4l-.45-.33L7 11.2V12h10v-1.2l-.65-.78z"
          />
        </svg>
      </button>
      <button
        @click="editor.chain().focus().toggleHighlight().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('highlight') }"
        class="editor-btn"
        title="Highlight"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m19.1 17.2l-2.3-2.3l-1.1 1.1l2.3 2.3c.2.2.5.2.7 0l.4-.4c.2-.2.2-.5 0-.7M14.5 10.4L11 6.9l-1.3 1.3l.5.5c.9.9 1.5 2.2 1.5 3.5v.1l1.8 1.8l3.4-3.4l-2.4-2.3M9.9 11.5c-.2-.6-.2-1.2 0-1.8l-1.8-1.8l-2.8 2.8l1.8 1.8c.6-.2 1.2-.2 1.8 0M17 5.9l1.1-1.1c.2-.2.2-.5 0-.7l-.4-.4c-.2-.2-.5-.2-.7 0L16 4.8l1.1 1.1M5.6 15.3l-2.8-2.8l1.1-1.1l2.8 2.8l-1.1 1.1Z"
          />
        </svg>
      </button>

      <div class="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="editor-btn"
        title="Bullet List"
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
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        type="button"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        class="editor-btn"
        title="Numbered List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7 5h14v2H7V5m0 6h14v2H7v-2m0 6h14v2H7v-2M2 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5m0-6c0-.83.67-1.5 1.5-1.5S5 4.67 5 5.5S4.33 7 3.5 7S2 6.33 2 5.5m0 12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5"
          />
        </svg>
      </button>

      <div class="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
      <button
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        type="button"
        class="editor-btn"
        title="Align Left"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 21v-2h18v2H3m0-4v-2h12v2H3m0-4v-2h18v2H3m0-4V7h12v2H3m0-4V3h18v2H3Z"
          />
        </svg>
      </button>
      <button
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        type="button"
        class="editor-btn"
        title="Align Center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 21v-2h18v2H3m4-4v-2h10v2H7m-4-4v-2h18v2H3m4-4V7h10v2H7m-4-4V3h18v2H3Z"
          />
        </svg>
      </button>
      <button
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        type="button"
        class="editor-btn"
        title="Align Right"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 21v-2h18v2H3m6-4v-2h12v2H9m-6-4v-2h18v2H3m6-4V7h12v2H9m-6-4V3h18v2H3Z"
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
import { watch, onBeforeUnmount } from "vue";

// ✅ Import ekstensi yang baru diinstal
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue || "",
  extensions: [
    StarterKit,
    // ✅ Daftarkan ekstensi baru di sini
    Underline,
    Strike,
    Highlight,
    TextAlign.configure({
      types: ["heading", "paragraph"], // Terapkan align pada heading dan paragraf
    }),
  ],
  onUpdate: () => {
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
    const editorHTML = editor.value.isEmpty ? "" : editor.value.getHTML();
    const propValue = value || "";
    if (editorHTML === propValue) return;
    editor.value.commands.setContent(propValue, false);
  }
);

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>
