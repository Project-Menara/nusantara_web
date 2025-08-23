const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

export function formatRupiah(number) {
  // Pastikan input adalah angka, jika tidak, kembalikan nilai default
  if (typeof number !== 'number') {
    return rupiahFormatter.format(0);
  }
  return rupiahFormatter.format(number);
}