// data/model/EventResponseModel.js
import { EventEntity, EventBundleItemEntity, ProductEntity } from '../../../event/domain/entities/EventEntity';
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity"; // Sesuaikan path jika perlu

// Helper mapper untuk Product
const mapProduct = (item) => new ProductEntity({
    id: item.id, name: item.name, image: item.image, code: item.code, price: item.price, unit: item.unit,
    description: item.description, status: item.status, typeProduct: item.type_product,
    productImages: item.product_images, createdBy: item.created_by, createdAt: item.created_at,
    updatedAt: item.updated_at, deletedAt: item.deleted_at,
});

// Helper mapper untuk EventBundleItem
const mapEventBundleItem = (item) => new EventBundleItemEntity({
    id: item.id, event: item.event,
    product: item.product ? mapProduct(item.product) : null,
    quantity: item.quantity, createdAt: item.created_at, updatedAt: item.updated_at, deletedAt: item.deleted_at
});

export class EventResponseModel {
  constructor({ events, pagination }) {
    this.events = events;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const events = json.data.map(item => new EventEntity({
      id: item.id,
      name: item.name,
      typeEvent: item.type_event,
      startDate: item.start_date,
      endDate: item.end_date,
      cover: item.cover,
      status: item.status,
      eventProduct: item.event_product,
      eventBundleBuy: item.event_bundle_buy?.map(mapEventBundleItem),
      eventBundleReward: item.event_bundle_reward?.map(mapEventBundleItem),
      createdBy: item.created_by,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at,
    }));

    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      perPage: json.pagination.per_page,
      totalData: json.pagination.total_data,
      totalPages: json.pagination.total_pages,
    });

    return new EventResponseModel({ events, pagination });
  }
}