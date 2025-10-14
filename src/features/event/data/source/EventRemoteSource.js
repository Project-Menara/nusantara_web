// data/source/EventRemoteSource.js
import apiClient from "@/lib/apiClient.js"; // Menggunakan apiClient seperti contoh Anda

export class EventRemoteSource {
  async getEvents(params) {
    // params bisa berisi { page: 1, search: 'keyword' }
    const response = await apiClient.get('/event', { params });
    return response.data;
  }

  async getEventById(id) {
    const response = await apiClient.get(`/event/${id}`);
    return response.data;
  }

  async createEvent(data) {
    const response = await apiClient.post('/event/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateEvent(id, data) {
    // Sesuai spesifikasi Anda: POST dengan _method: 'PUT'
    data.append('_method', 'PUT');
    
    const response = await apiClient.post(`/event/${id}/edit`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateEventStatus(id, status) {
    // Sesuai spesifikasi Anda: PUT dengan body JSON
    const response = await apiClient.put(`/event/${id}/edit-status`, { status });
    return response.data;
  }

  async deleteEvent(id) {
    const response = await apiClient.delete(`/event/${id}/delete`);
    return response.data;
  }
}