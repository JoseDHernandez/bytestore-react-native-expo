import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import ChangeQuantity from "@/components/ChangeQuantity";
import { useLocalSearchParams, router } from "expo-router";

import { getProductById, getProductsLimited } from "@/api/products.service";

import type { Product } from "@/types/product";

import ProductCard from "@/components/ProductCard";
import Score from "@/components/Score";

import { getDiscount, numberFormat } from "@/utils/textFormatters";
import { useCartStore } from "@/store/cartStore";

export default function ProductPage() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  async function loadData() {
    try {
      const [productData, related] = await Promise.all([
        getProductById(id),
        getProductsLimited(5),
      ]);
      setProduct(productData);
      setRelatedProducts((related ?? []).filter((item) => item.id !== id));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Producto no encontrado</Text>
      </View>
    );
  }

  const finalPrice = getDiscount(product.price, product.discount);

  const capacity =
    product.disk_capacity > 999
      ? `${product.disk_capacity / 1000} TB`
      : `${product.disk_capacity} GB`;

  function handleAddToCart() {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      stock: product.stock,
      discount: product.discount,
      brand: product.brand,
      model: product.model,
      quantity: quantity,
    });
    setQuantity(1);
  }

  function handleBuyNow() {
    if (!product) return;
    handleAddToCart();
    router.push("/cart");
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-4 pb-10">
        {/* PRODUCT */}
        <Image
          source={{
            uri: product.image,
          }}
          className="w-full h-72"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-center mt-4">
          {product.name}
        </Text>

        <View className="items-center mt-3">
          <Score qualification={4} size={24} />
        </View>

        {/* PRICE */}
        <View className="items-center mt-5">
          <Text className="text-4xl font-bold">{numberFormat(finalPrice)}</Text>

          {product.discount > 0 && (
            <View className="flex-row items-center mt-2 gap-2">
              <Text className="line-through text-gray-400">
                {numberFormat(product.price)}
              </Text>

              <View className="bg-red-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-semibold">
                  -{product.discount}%
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* QUANTITY */}
        <ChangeQuantity
          stock={product.stock}
          onChange={(qty) => setQuantity(qty)}
        />

        {/* ACTIONS */}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={product.stock < 1}
            className={`flex-1 rounded-xl h-12 items-center justify-center border ${
              product.stock < 1
                ? "border-gray-300 bg-gray-100 opacity-50"
                : "border-green-600"
            }`}
          >
            <Text
              className={`font-semibold ${
                product.stock < 1 ? "text-gray-500" : "text-green-700"
              }`}
            >
              Agregar {quantity > 1 ? `(` + quantity + `)` : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuyNow}
            disabled={product.stock < 1}
            className={`flex-1 rounded-xl h-12 items-center justify-center ${
              product.stock < 1 ? "bg-gray-300 opacity-50" : "bg-black"
            }`}
          >
            <Text className="font-semibold text-white">
              {product.stock < 1
                ? "No disponible"
                : `Comprar ${quantity > 1 ? `(` + quantity + `)` : ""}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DESCRIPTION */}
        <View className="mt-8">
          <Text className="text-2xl font-bold mb-3">Descripción</Text>

          <Text className="text-gray-700 leading-6">{product.description}</Text>
        </View>

        {/* FEATURES */}
        <Text className="text-2xl font-bold mt-10 mb-5">Características</Text>

        {/* GENERAL */}
        <FeatureSection title="General">
          <FeatureRow label="Marca" value={product.brand} />
          <FeatureRow label="Modelo" value={product.model} />
          <FeatureRow label="Sistema" value={product.system.system} />
          <FeatureRow label="Distribución" value={product.system.distribution} />
        </FeatureSection>

        {/* PROCESSOR */}
        <FeatureSection title="Almacenamiento y procesamiento">
          <FeatureRow label="Marca" value={product.processor.brand} />
          <FeatureRow label="Serie" value={product.processor.family} />
          <FeatureRow label="Modelo" value={product.processor.model} />
          <FeatureRow label="Núcleos" value={String(product.processor.cores)} />
          <FeatureRow label="Almacenamiento" value={capacity} />
          <FeatureRow label="Velocidad" value={product.processor.speed} />
          <FeatureRow label="RAM" value={`${product.ram_capacity} GB`} />
        </FeatureSection>

        {/* DISPLAY */}
        <FeatureSection title="Pantalla">
          <FeatureRow label="Tamaño" value={String(product.display.size)} />
          <FeatureRow label="Resolución" value={product.display.resolution} />
          <FeatureRow label="Tarjeta gráfica" value={product.display.graphics} />
          {!!product.display.brand && (
            <FeatureRow label="Marca" value={product.display.brand} />
          )}
        </FeatureSection>

        {/* RELATED */}
        <Text className="text-2xl font-bold mt-10 mb-5">Otros productos</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {relatedProducts.map((item) => (
            <View key={item.id} className="w-52 mr-4">
              <ProductCard data={item} />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function FeatureSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-7">
      <Text className="text-xl font-bold mb-3 text-gray-900">{title}</Text>

      <View className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
        {children}
      </View>
    </View>
  );
}

function FeatureRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-start px-4 py-4 border-b border-gray-200">
      <Text className="font-semibold text-gray-900 w-[40%]">{label}</Text>

      <Text className="text-gray-700 flex-1 text-right">{value}</Text>
    </View>
  );
}