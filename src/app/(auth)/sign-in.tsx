import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/schemas/usersSchemas";

import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const { signIn } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  register("email");
  register("password");

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);

      await signIn(data);

      router.replace("/(tabs)");
    } catch {
      setError("Credenciales inválidas");
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-center mb-10">Ingreso</Text>

      <View className="gap-5">
        {/* EMAIL */}
        <View>
          <Text className="mb-2 text-base">Correo electrónico</Text>

          <TextInput
            className="border border-gray-300 rounded-lg p-4"
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setValue("email", text)}
          />

          {errors.email && (
            <Text className="text-red-500 mt-1">{errors.email.message}</Text>
          )}
        </View>

        {/* PASSWORD */}
        <View>
          <Text className="mb-2 text-base">Contraseña</Text>

          <TextInput
            className="border border-gray-300 rounded-lg p-4"
            placeholder="********"
            secureTextEntry
            onChangeText={(text) => setValue("password", text)}
          />

          {errors.password && (
            <Text className="text-red-500 mt-1">{errors.password.message}</Text>
          )}
        </View>

        {/* ERROR API */}
        {error && <Text className="text-red-500 text-center">{error}</Text>}

        {/* BUTTON */}
        <TouchableOpacity
          className="bg-green-600 rounded-xl p-4 mt-5 items-center"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white font-bold text-lg">Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
