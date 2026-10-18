import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "./src/components/ProductCard";
import OrderSummary from "./src/components/OrderSummary";
import Button from "./src/components/Button";
import { products, categories } from "./src/data/products";
import { changeQuantity, money, summarize } from "./src/utils/order";
import { colors as c } from "./src/theme";

function AppContent() {
  const { width } = useWindowDimensions();
  const desktop = width >= 1050;
  const columns = width >= 680 ? 2 : 1;
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("Todos");
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);
  useEffect(() => () => clearTimeout(noticeTimer.current), []);
  const order = summarize(cart, products);
  const visible = products.filter(
    (p) => category === "Todos" || p.category === category,
  );
  const change = (id, delta) =>
    setCart((current) => changeQuantity(current, id, delta));
  const add = (product) => {
    change(product.id, 1);
    setNotice(`${product.name} adicionado ao pedido`);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2200);
  };
  const checkout = () => {
    if (!order.count) return;
    setConfirmation(order);
    setCartOpen(false);
    setCart({});
  };
  const orderProps = {
    order,
    onChange: change,
    onClear: () => setCart({}),
    onCheckout: checkout,
  };
  const info = [
    [
      "01",
      "Promoção da casa",
      "Duplo smash por R$ 34,90.\nDois burgers, uma fome resolvida.",
    ],
    [
      "02",
      "Seu próximo encontro",
      "Terça a domingo, das 18h às 23h.\nSegunda é dia de descanso.",
    ],
    [
      "03",
      "Do seu jeito",
      "Dinheiro, crédito e débito no balcão.\nSem pagamento pelo aplicativo.",
    ],
    [
      "04",
      "Feito com capricho",
      "Ingredientes frescos, pão macio\ne sanduíches preparados na hora.",
    ],
  ];
  const header = (
    <View>
      <View style={s.hero}>
        <ImageBackground
          source={require("./assets/hero.jpg")}
          imageStyle={{ opacity: 0.5 }}
          style={s.heroPhoto}
        />
        <View style={s.heroContent}>
          <View style={s.heroPill}>
            <Text style={s.heroPillText}>FEITO NA HORA. FEITO PRA VOCÊ.</Text>
          </View>
          <Text
            style={[
              s.heroTitle,
              width < 680 && { fontSize: 38, lineHeight: 43 },
            ]}
          >
            Sua fome merece{"\n"}um{" "}
            <Text style={{ color: c.yellow }}>sanduba de verdade.</Text>
          </Text>
          <Text style={s.heroDescription}>
            Pão macio, ingredientes frescos e aquele sabor{"\n"}que transforma
            qualquer pausa.
          </Text>
          <Text style={s.heroDetail}>
            ✦ Artesanal do primeiro ao último pedaço
          </Text>
        </View>
        {desktop && (
          <View style={s.heroStamp}>
            <Text style={s.stampSmall}>SABOR QUE</Text>
            <Text style={s.stampBig}>abraça.</Text>
            <Text style={s.stampSmall}>DESDE A PRIMEIRA MORDIDA</Text>
          </View>
        )}
      </View>
      <View style={s.benefits}>
        <Text style={s.benefit}>◷ Preparado na hora</Text>
        <Text style={s.benefit}>✦ Ingredientes selecionados</Text>
        <Text style={s.benefit}>♡ Capricho em cada pedido</Text>
      </View>
      <View style={s.menuHeading}>
        <View>
          <Text style={s.eyebrow}>ESCOLHA SEU FAVORITO</Text>
          <Text style={s.sectionTitle}>O próximo pode ser o seu.</Text>
        </View>
        <Text style={s.productCount}>6 sandubas. Muito sabor.</Text>
      </View>
      <View style={s.filters}>
        {categories.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: item === category }}
            onPress={() => setCategory(item)}
            style={[s.filter, item === category && s.activeFilter]}
          >
            <Text
              style={[s.filterText, item === category && { color: c.white }]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <View style={s.topbar}>
        <View style={[s.navInner, width < 680 && { paddingHorizontal: 16 }]}>
          <View style={s.brand}>
            <View style={s.logo}>
              <Text style={s.logoText}>S.</Text>
            </View>
            <View>
              <Text style={[s.brandName, width < 400 && { fontSize: 17 }]}>
                sanduba<Text style={{ color: c.red }}> express</Text>
              </Text>
              <Text style={s.brandCaption}>SANDUÍCHES & BONS MOMENTOS</Text>
            </View>
          </View>
          <View style={s.navRight}>
            {width > 680 && (
              <Text style={s.navCaption}>Feito com fome de fazer bem.</Text>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Abrir pedido com ${order.count} ${order.count === 1 ? "item" : "itens"}`}
              onPress={() => setCartOpen(true)}
              style={s.cartButton}
            >
              <Text style={s.cartButtonText}>Pedido</Text>
              <Text style={s.cartBadge}>{order.count}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={[s.layout, width < 680 && { paddingHorizontal: 16 }]}>
        <View style={s.catalog}>
          <FlatList
            key={columns}
            data={visible}
            numColumns={columns}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                quantity={cart[item.id] || 0}
                onAdd={() => add(item)}
              />
            )}
            columnWrapperStyle={columns > 1 ? s.row : undefined}
            contentContainerStyle={[
              s.listContent,
              !desktop && { paddingBottom: 108 },
            ]}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            ListHeaderComponent={header}
            ListFooterComponent={
              <View style={s.footer}>
                <Text style={s.eyebrow}>BOM SABER</Text>
                <Text style={s.infoTitle}>Além do último pedaço.</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator
                  contentContainerStyle={s.infoScroll}
                >
                  {info.map(([n, title, body]) => (
                    <View key={n} style={s.infoCard}>
                      <Text style={s.infoNumber}>{n} / SANDUBA EXPRESS</Text>
                      <Text style={s.infoCardTitle}>{title}</Text>
                      <Text style={s.infoBody}>{body}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={s.footerLine}>
                  <Text style={s.footerBrand}>sanduba express.</Text>
                  <Text style={s.footerNote}>
                    Projeto acadêmico • pedidos simulados
                  </Text>
                </View>
              </View>
            }
          />
        </View>
        {desktop && (
          <View style={s.sidebar}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              <OrderSummary {...orderProps} />
              <View style={s.sideNote}>
                <Text style={s.sideNoteTitle}>
                  O melhor ingrediente? Capricho.
                </Text>
                <Text style={s.sideNoteBody}>
                  Seu sanduba só vai pra chapa depois da sua escolha. Do
                  jeitinho que tem que ser.
                </Text>
                <Text style={s.sideNoteMark}>BOM APETITE! ✦</Text>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
      {!desktop && (
        <View style={s.mobileBar}>
          <Button
            accessibilityLabel={`Ver pedido com ${order.count} ${order.count === 1 ? "item" : "itens"}`}
            onPress={() => setCartOpen(true)}
            style={{ flex: 1 }}
          >
            Ver pedido ({order.count}) • {money(order.total)} →
          </Button>
        </View>
      )}
      {notice !== "" && (
        <View pointerEvents="none" style={s.toast}>
          <Text accessibilityLiveRegion="polite" style={s.toastText}>
            ✓ {notice}
          </Text>
        </View>
      )}
      <Modal
        visible={cartOpen || !!confirmation}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setCartOpen(false);
          setConfirmation(null);
        }}
      >
        <View style={s.overlay}>
          <View style={s.modal}>
            {!confirmation ? (
              <>
                <View style={s.modalHeader}>
                  <Text style={s.eyebrow}>SANDUBA EXPRESS</Text>
                  <Button
                    secondary
                    onPress={() => setCartOpen(false)}
                    accessibilityLabel="Fechar pedido"
                  >
                    Fechar ×
                  </Button>
                </View>
                <ScrollView>
                  <OrderSummary {...orderProps} />
                </ScrollView>
              </>
            ) : (
              <ScrollView contentContainerStyle={s.confirmContent}>
                <Text style={s.successMark}>✓</Text>
                <Text style={s.confirmTitle}>Pedido confirmado!</Text>
                <Text style={s.confirmText}>
                  Tudo certo com sua escolha. Esta é uma demonstração acadêmica:
                  nenhum pedido foi enviado à cozinha e não há cobrança.
                </Text>
                {confirmation?.items.map((p) => (
                  <View key={p.id} style={s.confirmRow}>
                    <Text style={s.confirmItem}>
                      {p.quantity} × {p.name}
                    </Text>
                    <Text style={s.confirmItem}>{money(p.subtotal)}</Text>
                  </View>
                ))}
                <View style={s.confirmRow}>
                  <Text style={s.confirmTotal}>
                    Total • {confirmation?.count}{" "}
                    {confirmation?.count === 1 ? "item" : "itens"}
                  </Text>
                  <Text style={s.confirmTotal}>
                    {money(confirmation?.total || 0)}
                  </Text>
                </View>
                <Button onPress={() => setConfirmation(null)}>
                  Voltar ao cardápio
                </Button>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.cream },
  topbar: {
    backgroundColor: c.white,
    borderBottomWidth: 1,
    borderColor: c.border,
  },
  navInner: {
    width: "100%",
    maxWidth: 1320,
    alignSelf: "center",
    minHeight: 94,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  brand: { flexDirection: "row", gap: 10, alignItems: "center", flexShrink: 1 },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: c.red,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: c.yellow,
    fontSize: 29,
    fontWeight: "900",
    fontStyle: "italic",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "900",
    color: c.ink,
    letterSpacing: -1,
  },
  brandCaption: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: c.muted,
    marginTop: 4,
  },
  navRight: { flexDirection: "row", alignItems: "center", gap: 24 },
  navCaption: { fontSize: 12, color: c.muted },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    paddingLeft: 14,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
  },
  cartButtonText: { color: c.ink, fontSize: 12, fontWeight: "700" },
  cartBadge: {
    color: c.white,
    backgroundColor: c.red,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    fontWeight: "700",
    fontSize: 11,
  },
  layout: {
    flex: 1,
    width: "100%",
    maxWidth: 1320,
    alignSelf: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 28,
  },
  catalog: { flex: 1, minWidth: 0 },
  listContent: { paddingTop: 28, paddingBottom: 30 },
  sidebar: { width: 318, paddingTop: 28 },
  row: { gap: 20 },
  hero: {
    minHeight: 330,
    borderRadius: 22,
    backgroundColor: "#292017",
    overflow: "hidden",
    justifyContent: "center",
  },
  heroPhoto: { position: "absolute", top: 0, bottom: 0, right: 0, left: "25%" },
  heroContent: { padding: 28, zIndex: 1 },
  heroPill: {
    backgroundColor: c.yellow,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    marginBottom: 18,
  },
  heroPillText: {
    fontSize: 8,
    letterSpacing: 1,
    fontWeight: "900",
    color: c.ink,
  },
  heroTitle: {
    fontSize: 45,
    fontWeight: "900",
    color: c.white,
    letterSpacing: -2,
    lineHeight: 49,
  },
  heroDescription: {
    marginTop: 15,
    fontSize: 13,
    lineHeight: 21,
    color: "#E4DDD5",
  },
  heroDetail: {
    marginTop: 22,
    fontSize: 10,
    color: c.yellow,
    fontWeight: "600",
  },
  heroStamp: {
    position: "absolute",
    right: 22,
    bottom: 23,
    borderRadius: 55,
    width: 108,
    height: 108,
    backgroundColor: c.yellow,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "12deg" }],
    zIndex: 2,
  },
  stampSmall: { fontSize: 6, fontWeight: "800", letterSpacing: 0.5 },
  stampBig: {
    fontSize: 23,
    fontWeight: "900",
    fontStyle: "italic",
    color: c.red,
    marginVertical: 4,
  },
  benefits: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: c.border,
  },
  benefit: { fontSize: 10, color: c.muted },
  menuHeading: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  eyebrow: { fontSize: 9, letterSpacing: 1.8, fontWeight: "800", color: c.red },
  sectionTitle: {
    marginTop: 7,
    fontSize: 28,
    letterSpacing: -1.1,
    fontWeight: "800",
    color: c.ink,
  },
  productCount: { color: c.muted, fontSize: 10, paddingBottom: 4 },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 22,
  },
  filter: {
    paddingHorizontal: 17,
    paddingVertical: 12,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
  },
  activeFilter: { backgroundColor: c.red, borderColor: c.red },
  filterText: { fontSize: 12, fontWeight: "600", color: c.muted },
  footer: { paddingTop: 35 },
  infoTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: c.ink,
    letterSpacing: -0.7,
    marginTop: 7,
    marginBottom: 18,
  },
  infoScroll: { gap: 14, paddingBottom: 14 },
  infoCard: {
    width: 255,
    padding: 20,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 16,
    backgroundColor: "#EFECE3",
    gap: 13,
  },
  infoNumber: { fontSize: 8, letterSpacing: 1, color: c.muted },
  infoCardTitle: { fontSize: 17, fontWeight: "800", color: c.ink },
  infoBody: { fontSize: 12, lineHeight: 20, color: c.muted },
  footerLine: {
    borderTopWidth: 1,
    borderColor: c.border,
    paddingTop: 25,
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  footerBrand: {
    color: c.red,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  footerNote: { color: c.muted, fontSize: 10 },
  sideNote: {
    padding: 24,
    marginTop: 18,
    backgroundColor: "#F0EBDD",
    borderRadius: 18,
  },
  sideNoteTitle: { fontSize: 16, fontWeight: "800", color: c.ink },
  sideNoteBody: { fontSize: 12, color: c.muted, lineHeight: 20, marginTop: 10 },
  sideNoteMark: {
    color: c.red,
    fontWeight: "800",
    letterSpacing: 2,
    fontSize: 9,
    marginTop: 22,
  },
  mobileBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: c.cream,
    borderTopWidth: 1,
    borderColor: c.border,
    flexDirection: "row",
  },
  toast: {
    position: "absolute",
    alignSelf: "center",
    bottom: 95,
    backgroundColor: c.ink,
    padding: 15,
    borderRadius: 12,
    maxWidth: "90%",
  },
  toastText: { color: c.white, fontSize: 12, fontWeight: "600" },
  overlay: {
    flex: 1,
    backgroundColor: "#191510B8",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: c.cream,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    borderRadius: 24,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  confirmContent: { padding: 16, gap: 20 },
  successMark: {
    backgroundColor: "#E3EEDC",
    color: c.green,
    fontSize: 35,
    fontWeight: "800",
    width: 72,
    height: 72,
    textAlign: "center",
    lineHeight: 72,
    borderRadius: 36,
    alignSelf: "center",
  },
  confirmTitle: {
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
    color: c.ink,
  },
  confirmText: {
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    color: c.muted,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  confirmItem: { fontSize: 13, color: c.ink, flexShrink: 1 },
  confirmTotal: { fontSize: 18, fontWeight: "800", color: c.red },
});
