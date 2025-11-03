// data/repository/EventRepository.js
import { IEventRepository } from '../../domain/repository/IEventRepository';
import { EventRemoteSource } from '../source/EventRemoteSource';
import { EventResponseModel } from '../model/EventResponseModel';
import { EventEntity, EventBundleItemEntity, EventProductDiscountEntity } from '../../../event/domain/entities/EventEntity';
import { left, right } from '@/core/error/failure';
import { ServerFailure } from '@/core/error/failure';

// Helper mapper untuk data tunggal (digunakan di create, update, getById)
const mapSingleResponseToEntity = (data) => {

    const mapEventBundleItem = (item) => new EventBundleItemEntity({
        id: item.id, event: item.event,
        product: item.product,
        quantity: item.quantity, createdAt: item.created_at, updatedAt: item.updated_at, deletedAt: item.deleted_at
    });

    // ✅ PERBAIKAN: Lakukan hal yang sama untuk 'mapEventProductDiscount'.
    const mapEventProductDiscount = (item) => new EventProductDiscountEntity({
        id: item.id,
        event: item.event,
        product: item.product,
        discountPercent: item.discount_percent,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        deletedAt: item.deleted_at
    });

    return new EventEntity({
        id: data.id,
        name: data.name,
        typeEvent: data.type_event,
        startDate: data.start_date,
        endDate: data.end_date,
        cover: data.cover,
        status: data.status,
        eventProducts: data.event_product?.map(mapEventProductDiscount),
        eventBundleBuy: data.event_bundle_buy?.map(mapEventBundleItem),
        eventBundleReward: data.event_bundle_reward?.map(mapEventBundleItem),
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        deletedAt: data.deleted_at,
    });
}

export class EventRepository extends IEventRepository {
  constructor() {
    super();
    this.remoteSource = new EventRemoteSource();
  }

  async getEvents(params) {
    try {
      const response = await this.remoteSource.getEvents(params);
      const model = EventResponseModel.fromJSON(response);
      return right({
        events: model.events,
        pagination: model.pagination,
      });
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal mengambil data event."));
    }
  }

  async getEventById(id) {
    try {
      const response = await this.remoteSource.getEventById(id);
      const entity = mapSingleResponseToEntity(response.data);
      return right(entity);
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal mengambil detail event."));
    }
  }

  async createEvent(data) {
    try {
      const response = await this.remoteSource.createEvent(data);
      
      return right({ message: response.message });

    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal membuat event."));
    }
  }

  async updateEvent(id, data) {
    try {
      const response = await this.remoteSource.updateEvent(id, data);
      
      // ✅ PERBAIKAN: Ganti baris ini.
      // Jangan lagi mencoba memetakan ke entity, cukup kembalikan pesan sukses.
      return right({ message: response.message });

    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal memperbarui event."));
    }
  }

  async updateEventStatus(id, status) {
    try {
      const response = await this.remoteSource.updateEventStatus(id, status);
      return right({ message: response.message });
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal memperbarui status event."));
    }
  }

  async deleteEvent(id) {
    try {
      const response = await this.remoteSource.deleteEvent(id);
      return right({ message: response.message }); // Sesuai API: "Event deleted successfully"
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal menghapus event."));
    }
  }
}