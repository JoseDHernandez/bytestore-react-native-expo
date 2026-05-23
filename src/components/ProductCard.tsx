import { Image, Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import type { Product } from "@/types/product";

import { getDiscount, numberFormat } from "@/utils/textFormatters";

import Score from "@/components/Score";

interface ProductCardProps {
  data: Product;
}

export default function ProductCard({ data }: ProductCardProps) {
  const newPrice = numberFormat(getDiscount(data.price, data.discount));

  return (
    <Pressable
      onPress={() => router.push(`/product/${data.id}`)}
      className="flex-1"
    >
      {({ pressed }) => (
        <View
          className={`bg-white border border-gray-200 rounded-2xl px-3 py-4 shadow-sm ${
            pressed ? "scale-[0.98] opacity-90" : ""
          }`}
        >
          {/* NAME */}
          <Text
            numberOfLines={2}
            className="text-center font-medium uppercase min-h-[45px]"
          >
            {data.name}
          </Text>

          {/* IMAGE */}
          <View className="h-[180px] justify-center items-center overflow-hidden mt-2">
            <Image
              source={{
                uri: data.image,
              }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* SCORE */}
          <View className="items-center mt-2">
            <Score qualification={4.5} />
          </View>

          {/* PRICE */}
          <View className="mt-4 min-h-[50px] items-center justify-center">
            <Text className="text-xl font-bold">{newPrice}</Text>

            {data.discount > 0 && (
              <Text className="text-gray-400 line-through text-sm mt-1">
                {numberFormat(data.price)}
              </Text>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}
