import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import { router, useLocalSearchParams } from "expo-router";

import { getProductById, getProductsLimited } from "@/api/products.service";

import { Product } from "@/types/product";

import Score from "@/components/Score";

import { getDiscount, numberFormat } from "@/utils/textFormatters";

export default function ProductPage() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [product, setProduct] = useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [productData, related] = await Promise.all([
        getProductById(id),
        getProductsLimited(5),
      ]);

      setProduct(productData);

      setRelatedProducts(related ?? []);
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

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <Image
          source={{
            uri: product.image,
          }}
          className="w-full h-72"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold mt-4">{product.name}</Text>

        <Text className="text-gray-500 mt-1">
          {product.brand} · {product.model}
        </Text>

        <View className="mt-4">
          <Score qualification={4} size={24} />
        </View>

        <Text className="text-4xl font-bold mt-4">
          {numberFormat(finalPrice)}
        </Text>

        {product.discount > 0 && (
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="line-through text-gray-400">
              {numberFormat(product.price)}
            </Text>

            <Text className="bg-red-500 text-white px-2 py-1 rounded">
              -{product.discount}%
            </Text>
          </View>
        )}

        <Text className="text-gray-700 mt-6 leading-6">
          {product.description}
        </Text>

        {/* botones */}
        <View className="flex-row gap-3 mt-8">
          <TouchableOpacity className="flex-1 bg-green-600 p-4 rounded-2xl items-center">
            <Text className="text-white font-bold">Agregar</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-black p-4 rounded-2xl items-center">
            <Text className="text-white font-bold">Comprar</Text>
          </TouchableOpacity>
        </View>

        {/* características */}
        <Text className="text-2xl font-bold mt-10 mb-4">Características</Text>

        <FeatureRow label="Marca" value={product.brand} />

        <FeatureRow label="Modelo" value={product.model} />

        <FeatureRow label="Sistema" value={product.system.system} />

        <FeatureRow label="Distribución" value={product.system.distribution} />

        <FeatureRow
          label="Procesador"
          value={`${product.processor.brand} ${product.processor.family}`}
        />

        <FeatureRow label="Núcleos" value={String(product.processor.cores)} />

        <FeatureRow label="Velocidad" value={product.processor.speed} />

        <FeatureRow label="RAM" value={`${product.ram_capacity} GB`} />

        <FeatureRow label="Almacenamiento" value={capacity} />

        <FeatureRow label="Pantalla" value={product.display.size.toString()} />

        <FeatureRow label="Resolución" value={product.display.resolution} />

        {/* relacionados */}
        <Text className="text-2xl font-bold mt-10 mb-5">Otros productos</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {relatedProducts.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="w-52 mr-4 bg-gray-100 rounded-2xl p-4"
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image
                source={{
                  uri: item.image,
                }}
                className="w-full h-36"
                resizeMode="contain"
              />

              <Text numberOfLines={2} className="font-semibold mt-2">
                {item.name}
              </Text>

              <Text className="font-bold text-lg mt-2">
                {numberFormat(getDiscount(item.price, item.discount))}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function FeatureRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-b border-gray-200 py-3 flex-row justify-between">
      <Text className="font-bold">{label}</Text>

      <Text className="text-gray-700 max-w-[60%] text-right">{value}</Text>
    </View>
  );
}
