import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/schemas/usersSchemas";

import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const { signIn } = useAuth();

  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);

      await signIn(data);

      router.replace("/(tabs)");
    } catch {
      setApiError("Credenciales inválidas");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow justify-center px-6 py-10"
      >
        {/* HEADER */}
        <View className="mb-10">
          <Text className="text-4xl font-bold text-center text-black">
            Ingreso
          </Text>

          <Text className="text-center text-gray-500 mt-2">
            Inicia sesión para continuar
          </Text>
        </View>

        <View className="gap-5">
          {/* EMAIL */}
          <View>
            <Text className="mb-2 text-base font-medium text-gray-700">
              Correo electrónico
            </Text>

            <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 h-14">
              <MaterialIcons name="email" size={22} color="#6B7280" />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="flex-1 ml-3 text-base"
                    placeholder="correo@ejemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {errors.email && (
              <Text className="text-red-500 mt-2">{errors.email.message}</Text>
            )}
          </View>

          {/* PASSWORD */}
          <View>
            <Text className="mb-2 text-base font-medium text-gray-700">
              Contraseña
            </Text>

            <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 h-14">
              <MaterialIcons name="lock" size={22} color="#6B7280" />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="flex-1 ml-3 text-base"
                    placeholder="********"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {errors.password && (
              <Text className="text-red-500 mt-2">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* API ERROR */}
          {apiError && (
            <View className="bg-red-100 border border-red-300 rounded-xl p-3">
              <Text className="text-red-600 text-center">{apiError}</Text>
            </View>
          )}

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            className={`rounded-2xl h-14 items-center justify-center mt-2 ${
              isSubmitting ? "bg-green-400" : "bg-green-600"
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Ingresar</Text>
            )}
          </TouchableOpacity>

          {/* REGISTER */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">¿No tienes cuenta?</Text>

            <TouchableOpacity onPress={() => router.push("/sign-up")}>
              <Text className="ml-2 font-semibold text-green-700">
                Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
