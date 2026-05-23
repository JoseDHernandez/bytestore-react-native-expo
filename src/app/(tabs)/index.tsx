import ProductCard from "@/components/ProductCard";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { getProductFilters, getProductsBySearch } from "@/api/products.service";

import type { Product, ProductFilters } from "@/types/product";

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
        renderItem={({ item }) => (
          <View className="flex-1 mx-2 mb-4">
            <ProductCard data={item} />
          </View>
        )}
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
        backgroundStyle={{
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: "#fff",
        }}
        handleIndicatorStyle={{
          backgroundColor: "#D1D5DB",
          width: 48,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pt-1 pb-8"
        >
          {/* HEADER */}
          <View className="mb-5">
            <Text className="text-2xl font-bold text-gray-900">Filtros</Text>

            <Text className="text-sm text-gray-500 mt-1">
              Personaliza tu búsqueda
            </Text>
          </View>

          {/* ORDENAR */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Ordenar por
            </Text>

            <View className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden justify-center">
              <Picker
                selectedValue={sort}
                onValueChange={setSort}
                style={{
                  height: 50,
                }}
              >
                <Picker.Item label="Ninguno" value="" />

                <Picker.Item label="Precio" value="price" />

                <Picker.Item label="Nombre" value="name" />
              </Picker>
            </View>
          </View>

          {/* ORDEN */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Orden
            </Text>

            <View className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
              <Picker
                selectedValue={order}
                onValueChange={(v) => setOrder(v)}
                style={{
                  height: 50,
                }}
              >
                <Picker.Item label="Ascendente" value="asc" />

                <Picker.Item label="Descendente" value="desc" />
              </Picker>
            </View>
          </View>

          {/* MARCA */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Marca
            </Text>

            <View className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
              <Picker
                selectedValue={selectedBrand}
                onValueChange={setSelectedBrand}
                style={{
                  height: 50,
                }}
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
            </View>
          </View>

          {/* PROCESADOR */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Procesador
            </Text>

            <View className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
              <Picker
                selectedValue={selectedProcessor}
                onValueChange={setSelectedProcessor}
                style={{
                  height: 50,
                }}
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
            </View>
          </View>

          {/* PANTALLA */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Pantalla
            </Text>

            <View className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
              <Picker
                selectedValue={selectedDisplay}
                onValueChange={setSelectedDisplay}
                style={{
                  height: 50,
                }}
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
            </View>
          </View>

          {/* BUTTONS */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 border border-gray-300 rounded-xl h-12 items-center justify-center"
              onPress={() => {
                setSort("");
                setOrder("asc");
                setSelectedBrand("");
                setSelectedProcessor("");
                setSelectedDisplay("");
              }}
            >
              <Text className="font-medium text-gray-700">Limpiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-[1.3] bg-green-600 rounded-xl h-12 items-center justify-center"
              onPress={() => {
                setProducts([]);
                setPage(1);

                loadProducts(1, true);

                bottomSheetRef.current?.close();
              }}
            >
              <Text className="text-white font-semibold">Aplicar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}
