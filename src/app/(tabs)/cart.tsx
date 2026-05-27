import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/types/cart";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Cross-platform Alert (funciona en Web + Android/iOS) ────────────────────
type AlertButton = {
  text: string;
  style?: "cancel" | "destructive" | "default";
  onPress?: () => void;
};

type AlertConfig = {
  title: string;
  message?: string;
  buttons: AlertButton[];
};

const CrossAlert = ({
  visible,
  config,
  onClose,
}: {
  visible: boolean;
  config: AlertConfig | null;
  onClose: () => void;
}) => {
  if (!config) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={alertStyles.overlay}>
        <View style={alertStyles.box}>
          <Text style={alertStyles.title}>{config.title}</Text>
          {config.message ? (
            <Text style={alertStyles.message}>{config.message}</Text>
          ) : null}
          <View style={alertStyles.btnRow}>
            {config.buttons.map((btn, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  alertStyles.btn,
                  btn.style === "destructive" && alertStyles.btnDestructive,
                  btn.style === "cancel" && alertStyles.btnCancel,
                ]}
                onPress={() => {
                  onClose();
                  btn.onPress?.();
                }}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    alertStyles.btnText,
                    btn.style === "destructive" &&
                      alertStyles.btnTextDestructive,
                    btn.style === "cancel" && alertStyles.btnTextCancel,
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Hook para manejar el alert cross-platform
const useCrossAlert = () => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig | null>(null);

  const showAlert = useCallback(
    (title: string, message: string | undefined, buttons: AlertButton[]) => {
      setConfig({ title, message, buttons });
      setVisible(true);
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setVisible(false);
  }, []);

  return { visible, config, showAlert, hideAlert };
};

// ─── Quantity Selector ───────────────────────────────────────────────────────
const QuantitySelector = ({
  item,
  onShowAlert,
}: {
  item: CartItem;
  onShowAlert: (
    title: string,
    message: string | undefined,
    buttons: AlertButton[],
  ) => void;
}) => {
  const { updateQuantity, removeItem } = useCartStore();

  const decrement = () => {
    if (item.quantity === 1) {
      onShowAlert(
        "Eliminar producto",
        `¿Quieres eliminar "${item.name}" del carrito?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => removeItem(item.id),
          },
        ],
      );
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const increment = () => {
    if (item.stock !== undefined && item.quantity >= item.stock) return;
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <View style={styles.qtyRow}>
      <TouchableOpacity
        style={styles.qtyBtn}
        onPress={decrement}
        activeOpacity={0.7}
      >
        <Text style={styles.qtyBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.qtyValue}>{item.quantity}</Text>
      <TouchableOpacity
        style={[
          styles.qtyBtn,
          item.stock !== undefined &&
            item.quantity >= item.stock &&
            styles.qtyBtnDisabled,
        ]}
        onPress={increment}
        activeOpacity={0.7}
        disabled={item.stock !== undefined && item.quantity >= item.stock}
      >
        <Text style={styles.qtyBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Cart Item Card ──────────────────────────────────────────────────────────
const CartCard = React.memo(
  ({
    item,
    onShowAlert,
  }: {
    item: CartItem;
    onShowAlert: (
      title: string,
      message: string | undefined,
      buttons: AlertButton[],
    ) => void;
  }) => {
    const { removeItem } = useCartStore();

    return (
      <View style={styles.card}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Text style={styles.cardImagePlaceholderText}>📦</Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>
            ${item.price.toLocaleString("es-CO")}
          </Text>
          {item.stock !== undefined && item.stock <= 5 && (
            <Text style={styles.stockWarning}>
              Solo {item.stock} disponibles
            </Text>
          )}
          <QuantitySelector item={item} onShowAlert={onShowAlert} />
        </View>

        <View style={styles.cardRight}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeItem(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.cardSubtotal}>
            ${(item.price * item.quantity).toLocaleString("es-CO")}
          </Text>
        </View>
      </View>
    );
  },
);

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyCart = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>🛒</Text>
    <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
    <Text style={styles.emptySubtitle}>
      Agrega productos desde el catálogo para verlos aquí.
    </Text>
  </View>
);

// ─── Summary Row ─────────────────────────────────────────────────────────────
const SummaryRow = ({
  label,
  value,
  bold,
  large,
}: {
  label: string;
  value: string;
  bold?: boolean;
  large?: boolean;
}) => (
  <View style={styles.summaryRow}>
    <Text
      style={[
        styles.summaryLabel,
        bold && styles.summaryBold,
        large && styles.summaryLarge,
      ]}
    >
      {label}
    </Text>
    <Text
      style={[
        styles.summaryValue,
        bold && styles.summaryBold,
        large && styles.summaryLarge,
      ]}
    >
      {value}
    </Text>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function CartScreen() {
  const { items, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const { visible, config, showAlert, hideAlert } = useCrossAlert();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const shippingThreshold = 150000;
  const shipping =
    totalPrice >= shippingThreshold || totalPrice === 0 ? 0 : 12000;
  const grandTotal = totalPrice + shipping;

  const handleCheckout = () => {
    if (items.length === 0) return;
    showAlert(
      "Confirmar pedido",
      `Total: $${grandTotal.toLocaleString("es-CO")}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            showAlert("¡Pedido realizado!", "Gracias por tu compra.", [
              { text: "OK", onPress: () => clearCart() },
            ]);
          },
        },
      ],
    );
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    showAlert(
      "Vaciar carrito",
      "¿Estás seguro de que quieres eliminar todos los productos?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Vaciar", style: "destructive", onPress: clearCart },
      ],
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartCard item={item} onShowAlert={showAlert} />
    ),
    [showAlert],
  );

  const keyExtractor = useCallback((item: CartItem) => String(item.id), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Cross-platform Alert Modal */}
      <CrossAlert visible={visible} config={config} onClose={hideAlert} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrito</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} activeOpacity={0.7}>
            <Text style={styles.clearBtn}>Vaciar</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length > 0 && (
        <Text style={styles.itemCount}>
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </Text>
      )}

      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyCart />}
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryCard}>
            <SummaryRow
              label="Subtotal"
              value={`$${totalPrice.toLocaleString("es-CO")}`}
            />
            <SummaryRow
              label="Envío"
              value={
                shipping === 0
                  ? "Gratis"
                  : `$${shipping.toLocaleString("es-CO")}`
              }
            />
            {shipping > 0 && (
              <Text style={styles.shippingNote}>
                Compra $
                {(shippingThreshold - totalPrice).toLocaleString("es-CO")} más
                para envío gratis
              </Text>
            )}
            <View style={styles.divider} />
            <SummaryRow
              label="Total"
              value={`$${grandTotal.toLocaleString("es-CO")}`}
              bold
              large
            />
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Text style={styles.checkoutBtnText}>Realizar pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Alert Styles ─────────────────────────────────────────────────────────────
const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
      web: { boxShadow: "0 8px 32px rgba(0,0,0,0.18)" } as any,
    }),
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  btnCancel: {
    backgroundColor: "#F3F4F6",
  },
  btnDestructive: {
    backgroundColor: "#FEE2E2",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#16a34a",
  },
  btnTextCancel: {
    color: "#6B7280",
  },
  btnTextDestructive: {
    color: "#EF4444",
  },
});

// ─── Styles ──────────────────────────────────────────────────────────────────
const ACCENT = "#16a34a";
const ACCENT_LIGHT = "#dcfce7";
const SURFACE = "#FFFFFF";
const BG = "#F5F5F5";
const TEXT_PRIMARY = "#1A1A1A";
const TEXT_SECONDARY = "#6B7280";
const BORDER = "#E5E7EB";
const RADIUS = 14;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BG,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  clearBtn: { fontSize: 14, color: ACCENT, fontWeight: "600" },
  itemCount: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  listContentEmpty: { flexGrow: 1 },
  card: {
    flexDirection: "row",
    backgroundColor: SURFACE,
    borderRadius: RADIUS,
    padding: 12,
    alignItems: "center",
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  cardImage: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  cardImagePlaceholder: { alignItems: "center", justifyContent: "center" },
  cardImagePlaceholderText: { fontSize: 28 },
  cardInfo: { flex: 1, gap: 4 },
  cardName: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },
  cardPrice: { fontSize: 13, color: TEXT_SECONDARY },
  stockWarning: { fontSize: 11, color: "#EF4444", fontWeight: "500" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 0 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: ACCENT_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnDisabled: { backgroundColor: "#F3F4F6" },
  qtyBtnText: {
    fontSize: 18,
    color: ACCENT,
    lineHeight: 22,
    fontWeight: "600",
  },
  qtyValue: {
    minWidth: 32,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 76,
  },
  deleteBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: { fontSize: 13, color: TEXT_SECONDARY, fontWeight: "600" },
  cardSubtotal: { fontSize: 15, fontWeight: "700", color: TEXT_PRIMARY },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: TEXT_PRIMARY },
  emptySubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "android" ? 16 : 8,
    gap: 12,
    backgroundColor: BG,
  },
  summaryCard: {
    backgroundColor: SURFACE,
    borderRadius: RADIUS,
    padding: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: TEXT_SECONDARY },
  summaryValue: { fontSize: 14, color: TEXT_PRIMARY, fontWeight: "500" },
  summaryBold: { fontWeight: "700", color: TEXT_PRIMARY },
  summaryLarge: { fontSize: 17 },
  shippingNote: {
    fontSize: 11,
    color: "#F59E0B",
    fontWeight: "500",
    textAlign: "right",
    marginTop: -4,
  },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: 4 },
  checkoutBtn: {
    backgroundColor: ACCENT,
    borderRadius: RADIUS,
    paddingVertical: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: ACCENT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
