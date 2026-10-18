import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import Button from "./Button";
import { colors as c } from "../theme";
import { money } from "../utils/order";
export default function ProductCard({ product, quantity, onAdd }) {
  return (
    <View style={s.card} testID={`product-${product.id}`}>
      <View>
        <Image
          source={product.image}
          accessibilityLabel={`Imagem ilustrativa: ${product.name}`}
          style={s.image}
        />
        <View style={s.tag}>
          <Text style={s.tagText}>{product.tag}</Text>
        </View>
      </View>
      <View style={s.content}>
        <Text style={s.title}>{product.name}</Text>
        <Text style={s.description}>{product.description}</Text>
        <View style={s.bottom}>
          <Text style={s.price}>{money(product.price)}</Text>
          <Text style={s.selected}>
            {quantity > 0 ? `${quantity} no pedido` : "Feito na hora"}
          </Text>
        </View>
        <Button
          accessibilityLabel={`Adicionar ${product.name} ao pedido`}
          onPress={onAdd}
        >
          + Adicionar ao pedido
        </Button>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
    overflow: "hidden",
  },
  image: { width: "100%", height: 175, backgroundColor: "#E7D9C8" },
  tag: {
    position: "absolute",
    left: 14,
    top: 14,
    backgroundColor: c.yellow,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "800",
    color: c.ink,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  content: { padding: 18, gap: 12 },
  title: { fontWeight: "800", fontSize: 20, color: c.ink, letterSpacing: -0.6 },
  selected: { color: c.green, fontSize: 10, fontWeight: "600" },
  description: { fontSize: 13, lineHeight: 20, color: c.muted, minHeight: 60 },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  price: { color: c.red, fontSize: 22, fontWeight: "800", letterSpacing: -0.8 },
});
