import { useMemo, useState } from "react";

import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  stock: number;

  onChange?: (quantity: number) => void;
};

export default function ChangeQuantity({ stock, onChange }: Props) {
  const [moreQuantity, setMoreQuantity] = useState(false);

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [customQuantity, setCustomQuantity] = useState("");

  const disabled = stock < 1;

  const quantities = useMemo(() => [1, 2, 3, 4, 5, 6], []);

  function selectQuantity(value: number) {
    setMoreQuantity(false);

    setSelectedQuantity(value);

    onChange?.(value);
  }

  function handleCustomQuantity(value: string) {
    const sanitized = value.replace(/[^0-9]/g, "");

    setCustomQuantity(sanitized);

    const quantity = Number(sanitized);

    if (!quantity) return;

    const safeQuantity = Math.min(Math.max(quantity, 1), stock);

    onChange?.(safeQuantity);
  }

  return (
    <View className="mt-6">
      <Text className="text-base font-semibold text-gray-900 mb-3">
        Cantidad de unidades
      </Text>

      {!moreQuantity ? (
        <View className="flex-row flex-wrap gap-2">
          {quantities.map((qty) => {
            const active = qty === selectedQuantity;

            return (
              <TouchableOpacity
                key={qty}
                disabled={disabled}
                className={`h-11 min-w-[48px] px-4 rounded-xl border items-center justify-center ${
                  active
                    ? "bg-green-600 border-green-600"
                    : "border-gray-300 bg-white"
                } ${disabled ? "opacity-40" : ""}`}
                onPress={() => selectQuantity(qty)}
              >
                <Text
                  className={`font-semibold ${
                    active ? "text-white" : "text-gray-700"
                  }`}
                >
                  {qty}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* MÁS */}
          <TouchableOpacity
            disabled={disabled}
            className={`h-11 px-4 rounded-xl border border-gray-300 flex-row items-center justify-center bg-gray-100 ${
              disabled ? "opacity-40" : ""
            }`}
            onPress={() => {
              setMoreQuantity(true);
              setCustomQuantity("");
            }}
          >
            <MaterialIcons name="add" size={18} color="#374151" />

            <Text className="ml-1 font-medium text-gray-700">Más</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="border border-gray-300 rounded-xl h-12 px-4 flex-row items-center bg-gray-50">
          <TextInput
            value={customQuantity}
            onChangeText={handleCustomQuantity}
            keyboardType="numeric"
            placeholder="N° de unidades"
            editable={!disabled}
            className="flex-1 text-base"
          />

          <TouchableOpacity
            onPress={() => {
              setMoreQuantity(false);

              setCustomQuantity("");

              selectQuantity(1);
            }}
          >
            <Text className="font-medium text-green-700">Volver</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text
        className={`mt-3 text-sm ${
          disabled ? "text-red-500" : "text-gray-500"
        }`}
      >
        {disabled
          ? "Sin unidades disponibles"
          : `Unidades disponibles: ${stock}`}
      </Text>
    </View>
  );
}
