// File: src/features/voucher/domain/entities/VoucherEntity.js

export class VoucherEntity {
  constructor({
    id,
    code,
    discountAmount,
    discountPercent,
    minimumSpend,
    pointCost,
    startDate,
    endDate,
    quota,
    claimedCount,
    description,
    discountType,
    isActive,
    createdAt,
  }) {
    this.id = id;
    this.code = code;
    this.discountAmount = discountAmount;
    this.discountPercent = discountPercent;
    this.minimumSpend = minimumSpend;
    this.pointCost = pointCost;
    // Kita ubah string tanggal menjadi objek Date agar lebih mudah diolah
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.quota = quota;
    this.claimedCount = claimedCount;
    this.description = description;
    this.discountType = discountType;
    this.isActive = isActive;
    this.createdAt = new Date(createdAt);
  }
}