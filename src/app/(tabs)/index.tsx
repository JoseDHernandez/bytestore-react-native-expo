import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { getProductFilters, getProductsBySearch } from "@/api/products.service";

import type { Product, ProductFilters } from "@/types/product";

import { getDiscount, numberFormat } from "@/utils/textFormatters";

type Order = "asc" | "desc";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [filters, setFilters] = useState<ProductFilters | null>(null);

  const [page, setPage] = useState(1);

  const [query, setQuery] = useState("");

  const [tempQuery, setTempQuery] = useState("");

  const [sort, setSort] = useState("");

  const [order, setOrder] = useState<Order>("desc");

  const [selectedBrand, setSelectedBrand] = useState("");

  const [selectedProcessor, setSelectedProcessor] = useState("");

  const [selectedDisplay, setSelectedDisplay] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "80%"], []);

  async function fetchFilters() {
    const data = await getProductFilters();

    setFilters(data);
  }

  function handleSearch() {
    setProducts([]);
    setPage(1);
    setQuery(tempQuery);
  }

  const loadProducts = useCallback(
    async (pageNumber = 1, refresh = false) => {
      try {
        const response = await getProductsBySearch({
          query,
          numberPage: pageNumber,
          sort,
          order,
        });

        if (!response) return;

        const newProducts = response.data;

        setProducts(
          refresh ? newProducts : (prev) => [...prev, ...newProducts],
        );

        setHasMore(pageNumber < response.pages);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [query, sort, order],
  );

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    setPage(1);

    loadProducts(1, true);
  }, [query, sort, order]);

  async function handleLoadMore() {
    if (loading || !hasMore) return;

    const nextPage = page + 1;

    setPage(nextPage);

    await loadProducts(nextPage);
  }

  async function handleRefresh() {
    setRefreshing(true);

    setPage(1);

    await loadProducts(1, true);
  }

  const filteredProducts = products.filter((product) => {
    const brandOk = !selectedBrand || product.brand === selectedBrand;

    const processorOk =
      !selectedProcessor || product.processor.brand === selectedProcessor;

    const displayOk =
      !selectedDisplay || product.display.brand === selectedDisplay;

    return brandOk && processorOk && displayOk;
  });

  function renderProduct({ item }: { item: Product }) {
    return (
      <TouchableOpacity
        className="flex-1 bg-white rounded-2xl border border-gray-200 p-4 mx-2 mb-4"
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image
          source={{
            uri: item.image,
          }}
          className="w-full h-40"
          resizeMode="contain"
        />

        <Text numberOfLines={2} className="font-semibold mt-3">
          {item.name}
        </Text>

        <Text className="text-2xl font-bold mt-3">
          {numberFormat(getDiscount(item.price, item.discount))}
        </Text>
      </TouchableOpacity>
    );
  }

  if (loading && products.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View className="px-4 py-4">
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-4"
                placeholder="Buscar productos..."
                value={tempQuery}
                onChangeText={setTempQuery}
              />

              <TouchableOpacity
                className="bg-green-600 rounded-xl px-5 justify-center"
                onPress={handleSearch}
              >
                <Text className="text-white font-bold">Buscar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-neutral-900 rounded-xl mt-3 p-4 items-center"
              onPress={() => bottomSheetRef.current?.snapToIndex(0)}
            >
              <Text className="text-white font-semibold">Filtros</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
      >
        <View className="px-5 py-4">
          <Text className="text-xl font-bold mb-5">Filtros</Text>

          <Text className="font-semibold mb-2">Ordenar por</Text>

          <Picker selectedValue={sort} onValueChange={setSort}>
            <Picker.Item label="Ninguno" value="" />

            <Picker.Item label="Precio" value="price" />

            <Picker.Item label="Nombre" value="name" />
          </Picker>

          <Text className="font-semibold mt-4 mb-2">Orden</Text>

          <Picker selectedValue={order} onValueChange={(v) => setOrder(v)}>
            <Picker.Item label="Ascendente" value="asc" />

            <Picker.Item label="Descendente" value="desc" />
          </Picker>

          <Text className="font-semibold mt-4 mb-2">Marca</Text>

          <Picker
            selectedValue={selectedBrand}
            onValueChange={setSelectedBrand}
          >
            <Picker.Item label="Todas" value="" />

            {filters?.brands.map((brand) => (
              <Picker.Item
                key={brand.name}
                label={brand.name}
                value={brand.name}
              />
            ))}
          </Picker>

          <Text className="font-semibold mt-4 mb-2">Procesador</Text>

          <Picker
            selectedValue={selectedProcessor}
            onValueChange={setSelectedProcessor}
          >
            <Picker.Item label="Todos" value="" />

            {filters?.processors.map((processor) => (
              <Picker.Item
                key={processor.name}
                label={processor.name}
                value={processor.name}
              />
            ))}
          </Picker>

          <Text className="font-semibold mt-4 mb-2">Pantalla</Text>

          <Picker
            selectedValue={selectedDisplay}
            onValueChange={setSelectedDisplay}
          >
            <Picker.Item label="Todas" value="" />

            {filters?.displays.map((display) => (
              <Picker.Item
                key={display.name}
                label={display.name}
                value={display.name}
              />
            ))}
          </Picker>

          <TouchableOpacity
            className="bg-green-600 rounded-xl mt-6 p-4 items-center"
            onPress={() => {
              setProducts([]);
              setPage(1);

              loadProducts(1, true);

              bottomSheetRef.current?.close();
            }}
          >
            <Text className="text-white font-bold">Aplicar filtros</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}
