// presentation/stores/useEventStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

// Import dari lapisan Data dan Domain Event
import { EventRepository } from "@/features/event/data/repository/EventRepository";
import { GetEventsUseCase } from "@/features/event/domain/use-case/GetEventsUseCase";
import { CreateEventUseCase } from "@/features/event/domain/use-case/CreateEventUseCase";
import { GetEventByIdUseCase } from "@/features/event/domain/use-case/GetEventByIdUseCase";
import { UpdateEventUseCase } from "@/features/event/domain/use-case/UpdateEventUseCase";
import { UpdateEventStatusUseCase } from "@/features/event/domain/use-case/UpdateEventStatusUseCase";
import { DeleteEventUseCase } from "@/features/event/domain/use-case/DeleteEventUseCase";

export const useEventStore = defineStore("event", () => {
  // --- STATE ---
  const events = ref([]);
  const pagination = ref(null);
  const isLoading = ref(false);
  const searchQuery = ref("");

  const isFormModalOpen = ref(false);
  const selectedEvent = ref(null);
  const isFormLoading = ref(false);
  const statusLoadingId = ref(null);

  const eventList = computed(() => events.value);

  // --- DEPENDENCIES ---
  const modalStore = useModalStore();
  const repository = new EventRepository();

  // --- USE CASES ---
  const getEventsUseCase = new GetEventsUseCase(repository);
  const createEventUseCase = new CreateEventUseCase(repository);
  const getEventByIdUseCase = new GetEventByIdUseCase(repository);
  const updateEventUseCase = new UpdateEventUseCase(repository);
  const updateEventStatusUseCase = new UpdateEventStatusUseCase(repository);
  const deleteEventUseCase = new DeleteEventUseCase(repository);

  // --- ACTIONS ---

  async function fetchEvents(params = { page: 1, search: "" }) {
    searchQuery.value = params.search || "";
    isLoading.value = true;
    const result = await getEventsUseCase.execute(params);
    isLoading.value = false;

    if (result.right) {
      events.value = result.right.events;
      pagination.value = result.right.pagination;
    } else {
      const message = mapFailureToMessage(result.left);
      modalStore.openModal({
        newTitle: "Error",
        newMessage: message,
        newStatus: "error",
      });
    }
  }

  async function changePage(page) {
    await fetchEvents({ page, search: searchQuery.value });
  }

  async function openFormModal(eventId = null) {
    selectedEvent.value = null; // Selalu reset

    if (eventId) {
      isFormModalOpen.value = true;
      isFormLoading.value = true;
      const result = await getEventByIdUseCase.execute(eventId);
      isFormLoading.value = false;

      if (result.right) {
        selectedEvent.value = result.right;
      } else {
        isFormModalOpen.value = false;
        modalStore.openModal({
          newTitle: "Error",
          newMessage: mapFailureToMessage(result.left),
          newStatus: "error",
        });
      }
    } else {
      isFormModalOpen.value = true;
    }
  }

  async function submitEvent(formData) {
    isFormLoading.value = true;
    const isEditMode = !!selectedEvent.value?.id;
    
    // Untuk 'update', kita asumsikan API mengembalikan data event lengkap,
    // jadi kita hanya perlu mengubah logika 'create'.
    const useCase = isEditMode ? updateEventUseCase : createEventUseCase;
    const params = isEditMode ? [selectedEvent.value.id, formData] : [formData];
    const result = await useCase.execute(...params);
    isFormLoading.value = false;

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw result.left;
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        // Pesan ini tetap relevan
        newMessage: `Event berhasil ${isEditMode ? "diperbarui" : "dibuat"}.`,
        newStatus: "success",
      });
      isFormModalOpen.value = false;

      // ✅ TINDAKAN KUNCI: Panggil fetchEvents untuk memuat ulang data.
      // Ini akan menampilkan event yang baru dibuat di tabel.
      // Sebaiknya fetch dari halaman pertama untuk melihat data terbaru.
      fetchEvents({ page: 1, search: "" }); 
    }
  }

  async function removeEvent(eventId) {
    isLoading.value = true;
    const result = await deleteEventUseCase.execute(eventId);
    isLoading.value = false;

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Event berhasil dihapus.",
        newStatus: "success",
      });
      fetchEvents({ page: pagination.value?.currentPage || 1, search: searchQuery.value });
    }
  }

  async function toggleEventStatus(event) {
    statusLoadingId.value = event.id;
    // API menerima status 0 atau 1
    const newStatusApi = event.status === 1 ? 0 : 1;
    const result = await updateEventStatusUseCase.execute(event.id, newStatusApi);
    statusLoadingId.value = null;

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Status event berhasil diperbarui.",
        newStatus: "success",
      });
      // Re-fetch untuk sinkronisasi data
      fetchEvents({ page: pagination.value?.currentPage || 1, search: searchQuery.value });
    }
  }

  return {
    events,
    pagination,
    isLoading,
    searchQuery,
    isFormModalOpen,
    selectedEvent,
    isFormLoading,
    eventList,
    statusLoadingId,
    fetchEvents,
    openFormModal,
    submitEvent,
    removeEvent,
    toggleEventStatus,
    changePage,
  };
});