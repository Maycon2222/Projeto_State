import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Button from "./Button";
import { colors as c } from "../theme";
import { money } from "../utils/order";
export default function OrderSummary({ order, onChange, onClear, onCheckout }) {
  return (
    <View style={s.card}>
      <View style={s.heading}>
        <Text style={s.title}>Seu pedido</Text>
        <Text style={s.badge}>{order.count}</Text>
      </View>
      <Text style={s.subtitle}>Uma boa escolha começa por aqui.</Text>
      {order.count === 0 ? (
        <View style={s.empty}>
          <Text style={s.bag}>♧</Text>
          <Text style={s.emptyTitle}>Bateu aquela fome?</Text>
          <Text style={s.emptyText}>
            Escolha seu sanduba favorito.{"\n"}A gente cuida do sabor.
          </Text>
        </View>
      ) : (
        <View style={s.items}>
          {order.items.map((item) => (
            <View key={item.id} style={s.item}>
              <View style={s.itemHeading}>
                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.itemPrice}>{money(item.subtotal)}</Text>
              </View>
              <View style={s.controls}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Diminuir ${item.name}`}
                  onPress={() => onChange(item.id, -1)}
                  style={s.step}
                >
                  <Text style={s.stepText}>−</Text>
                </Pressable>
                <Text
                  accessibilityLabel={`Quantidade de ${item.name}: ${item.quantity}`}
                  style={s.quantity}
                >
                  {item.quantity}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Aumentar ${item.name}`}
                  onPress={() => onChange(item.id, 1)}
                  style={s.step}
                >
                  <Text style={s.stepText}>+</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={s.line}>
        <Text style={s.label}>Subtotal</Text>
        <Text style={s.label}>{money(order.total)}</Text>
      </View>
      <View style={s.line}>
        <Text style={s.label}>Retirada no balcão</Text>
        <Text style={s.free}>Grátis</Text>
      </View>
      <View style={s.totalLine}>
        <Text style={s.total}>Total</Text>
        <Text testID="order-total" style={s.total}>
          {money(order.total)}
        </Text>
      </View>
      <Button disabled={!order.count} onPress={onCheckout}>
        Finalizar pedido →
      </Button>
      <Text style={s.note}>Pedido demonstrativo • sem cobrança</Text>
      {order.count > 0 && (
        <Pressable accessibilityRole="button" onPress={onClear} style={s.clear}>
          <Text style={s.clearText}>Limpar pedido</Text>
        </Pressable>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  card: {
    padding: 24,
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 20,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 22, fontWeight: "800", color: c.ink, letterSpacing: -0.6 },
  badge: {
    backgroundColor: c.yellow,
    borderRadius: 9,
    minWidth: 30,
    textAlign: "center",
    padding: 7,
    fontWeight: "800",
  },
  subtitle: { color: c.muted, fontSize: 12, marginTop: 7 },
  empty: { alignItems: "center", paddingVertical: 36, gap: 10 },
  bag: {
    fontSize: 40,
    color: c.red,
    backgroundColor: "#FCF0EC",
    borderRadius: 40,
    width: 76,
    height: 76,
    textAlign: "center",
    lineHeight: 76,
  },
  emptyTitle: { fontWeight: "700", color: c.ink, fontSize: 16 },
  emptyText: {
    color: c.muted,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
  },
  items: { marginVertical: 20, gap: 16 },
  item: {
    borderBottomWidth: 1,
    borderColor: c.border,
    paddingBottom: 14,
    gap: 10,
  },
  itemHeading: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  itemName: { flex: 1, fontWeight: "700", fontSize: 13, color: c.ink },
  itemPrice: { fontWeight: "700", fontSize: 13, color: c.red },
  controls: { flexDirection: "row", alignItems: "center", gap: 14 },
  step: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { fontSize: 20, color: c.red },
  quantity: { fontWeight: "700" },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { fontSize: 13, color: c.muted },
  free: { fontSize: 13, fontWeight: "700", color: c.green },
  totalLine: {
    borderTopWidth: 1,
    borderColor: c.border,
    paddingTop: 18,
    marginTop: 4,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  total: { fontSize: 23, fontWeight: "800", color: c.ink },
  note: { textAlign: "center", fontSize: 10, color: c.muted, marginTop: 13 },
  clear: { alignItems: "center", padding: 14, marginTop: 5 },
  clearText: { color: c.red, fontSize: 12, fontWeight: "600" },
});
