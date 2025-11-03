// data/model/EventResponseModel.js
import {
  EventEntity,
  EventBundleItemEntity,
  EventProductDiscountEntity,
} from "../../../event/domain/entities/EventEntity";
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity";

const mapEventBundleItem = (item) =>
  new EventBundleItemEntity({
    id: item.id,
    event: item.event,
    product: item.product, // <-- Cukup teruskan JSON mentah
    quantity: item.quantity,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    deletedAt: item.deleted_at,
  });

// ✅ PERBAIKAN: Lakukan hal yang sama untuk 'mapEventProductDiscount'
const mapEventProductDiscount = (item) =>
  new EventProductDiscountEntity({
    id: item.id,
    event: item.event,
    product: item.product, // <-- Cukup teruskan JSON mentah
    discountPercent: item.discount_percent,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    deletedAt: item.deleted_at,
  });

export class EventResponseModel {
  constructor({ events, pagination }) {
    this.events = events;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const events = json.data.map(
      (item) =>
        new EventEntity({
          id: item.id,
          name: item.name,
          typeEvent: item.type_event,
          startDate: item.start_date,
          endDate: item.end_date,
          cover: item.cover,
          status: item.status,

          // ✅ PERBAIKAN (Robustness):
          // Tangani kedua key 'event_product' (singular, dari getById)
          // dan 'event_products' (plural, dari getEvents)
          eventProducts:
            item.event_product?.map(mapEventProductDiscount) ||
            item.event_products?.map(mapEventProductDiscount),

          eventBundleBuy: item.event_bundle_buy?.map(mapEventBundleItem),
          eventBundleReward: item.event_bundle_reward?.map(mapEventBundleItem),
          createdBy: item.created_by,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          deletedAt: item.deleted_at,
        })
    );

    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      perPage: json.pagination.per_page,
      totalData: json.pagination.total_data,
      totalPages: json.pagination.total_pages,
    });

    return new EventResponseModel({ events, pagination });
  }
}
