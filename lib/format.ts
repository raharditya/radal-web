export function formatRp(amount: number) {
  return `Rp ${Math.abs(amount).toLocaleString('id-ID')}`;
}
