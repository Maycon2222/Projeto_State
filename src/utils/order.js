// Preços em centavos inteiros evitam erros de arredondamento.
export const money = (cents) =>
  `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
export function changeQuantity(cart, id, delta) {
  const next = { ...cart };
  const quantity = Math.max(0, (next[id] || 0) + delta);
  if (quantity === 0) delete next[id];
  else next[id] = quantity;
  return next;
}
export function summarize(cart, products) {
  const items = products
    .filter((p) => cart[p.id] > 0)
    .map((p) => ({
      ...p,
      quantity: cart[p.id],
      subtotal: cart[p.id] * p.price,
    }));
  return {
    items,
    count: items.reduce((n, p) => n + p.quantity, 0),
    total: items.reduce((n, p) => n + p.subtotal, 0),
  };
}
