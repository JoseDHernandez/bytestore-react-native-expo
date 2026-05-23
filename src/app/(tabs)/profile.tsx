import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateAccountSchema,
  updatePasswordFormSchema,
} from "@/schemas/usersSchemas";

import { useAuthStore } from "@/store/auth.store";

import { useAuth } from "@/hooks/useAuth";

import { changePassword, getUserById, updateUser } from "@/api/users.service";

import { authStorage } from "@/storage/auth.storage";

import type { UserDataItem, UserUpdate } from "@/types/user";

// Secciones disponibles
type Section = "account" | "password" | null;

// Tipado del formulario de password
type PasswordForm = {
  password: string;
  confirmPassword: string;
};

export default function ProfilePage() {
  // sesión actual
  const { user, logout } = useAuth();

  // actualizar zustand
  const { setUser } = useAuthStore();

  // loading de perfil
  const [loadingProfile, setLoadingProfile] = useState(true);

  // información del usuario obtenida del servidor
  const [profile, setProfile] = useState<UserDataItem | null>(null);

  // sección abierta
  const [section, setSection] = useState<Section>(null);

  /**
   * FORMULARIO:
   * editar cuenta
   */
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdate>({
    resolver: zodResolver(updateAccountSchema),
  });

  /**
   * FORMULARIO:
   * contraseña
   */
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(updatePasswordFormSchema),
  });

  /**
   * Obtener perfil desde la API
   */
  async function loadProfile() {
    // si aún no existe sesión
    if (!user?.id) return;

    try {
      setLoadingProfile(true);

      console.log("Solicitando usuario:", user.id);

      // petición al backend
      const data = await getUserById(user.id);

      console.log("Respuesta user service:", data);

      if (!data) {
        Alert.alert("Error", "No se pudo obtener la información del perfil");

        return;
      }

      // guardar perfil
      setProfile(data);

      // hidratar form
      reset({
        name: data.name,
        email: data.email,
        physical_address: data.physical_address,
      });
    } catch (error) {
      console.error("Error cargando perfil", error);
    } finally {
      setLoadingProfile(false);
    }
  }

  /**
   * IMPORTANTE:
   * esperar a que exista user.id
   *
   * antes estaba []
   * y corría antes de restaurar sesión
   */
  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  /**
   * Actualizar información
   */
  async function onUpdate(data: UserUpdate) {
    if (!user) return;

    const status = await updateUser(user.id, data);

    if (status !== 200) {
      Alert.alert("Error", "No se pudo actualizar la cuenta");

      return;
    }

    // sincronizar sesión
    const updatedUser = {
      ...user,
      ...data,
    };

    // actualizar zustand
    setUser(updatedUser);

    // persistir sesión
    await authStorage.saveSession(updatedUser);

    // actualizar UI local
    setProfile({
      ...profile!,
      ...data,
    });

    Alert.alert("Éxito", "Información actualizada");

    // cerrar sección
    setSection(null);
  }

  /**
   * Actualizar password
   */
  async function onPasswordUpdate(data: PasswordForm) {
    if (!user) return;

    const status = await changePassword({
      id: user.id,
      password: data.password,
    });

    if (status !== 200) {
      Alert.alert("Error", "No se pudo cambiar la contraseña");

      return;
    }

    Alert.alert("Éxito", "Contraseña actualizada");

    // limpiar form
    passwordForm.reset();

    // cerrar sección
    setSection(null);
  }

  /**
   * Cancelar edición de cuenta
   */
  function cancelAccountEdition() {
    if (!profile) return;

    // restaurar valores originales
    reset({
      name: profile.name,
      email: profile.email,
      physical_address: profile.physical_address,
    });

    setSection(null);
  }

  /**
   * Cancelar password
   */
  function cancelPasswordEdition() {
    passwordForm.reset();

    setSection(null);
  }

  // loading
  if (loadingProfile) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-neutral-100">
      <View className="px-5 py-8">
        <Text className="text-3xl font-bold mb-6">Mi cuenta</Text>

        {/* tarjeta info */}
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="text-xl font-bold mb-4">Información</Text>

          <View className="gap-3">
            <View>
              <Text className="text-neutral-500">Nombre</Text>

              <Text className="text-base font-medium">{profile?.name}</Text>
            </View>

            <View>
              <Text className="text-neutral-500">Correo</Text>

              <Text className="text-base font-medium">{profile?.email}</Text>
            </View>

            <View>
              <Text className="text-neutral-500">Dirección</Text>

              <Text className="text-base font-medium">
                {profile?.physical_address}
              </Text>
            </View>

            <View>
              <Text className="text-neutral-500">Rol</Text>

              <Text className="text-base font-medium">{profile?.role}</Text>
            </View>
          </View>
        </View>

        {/* acciones */}
        <View className="mt-5 gap-3">
          <TouchableOpacity
            className="bg-black rounded-2xl p-4"
            onPress={() => setSection(section === "account" ? null : "account")}
          >
            <Text className="text-white text-center font-semibold">
              Editar información
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-black rounded-2xl p-4"
            onPress={() =>
              setSection(section === "password" ? null : "password")
            }
          >
            <Text className="text-white text-center font-semibold">
              Cambiar contraseña
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-600 rounded-2xl p-4"
            onPress={logout}
          >
            <Text className="text-white text-center font-semibold">
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>

        {/* editar cuenta */}
        {section === "account" && (
          <View className="bg-white rounded-3xl p-5 mt-5">
            <Text className="text-xl font-bold mb-4">Editar información</Text>

            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  placeholder="Nombre"
                  className="border rounded-xl p-4 mb-2"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />

            {errors.name && (
              <Text className="text-red-500 mb-2">{errors.name.message}</Text>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextInput
                  placeholder="Correo"
                  className="border rounded-xl p-4 mb-2"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="physical_address"
              render={({ field }) => (
                <TextInput
                  placeholder="Dirección"
                  className="border rounded-xl p-4"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />

            <View className="flex-row gap-3 mt-5">
              <TouchableOpacity
                className="flex-1 bg-neutral-300 rounded-xl p-4"
                onPress={cancelAccountEdition}
              >
                <Text className="text-center font-bold">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-xl p-4"
                onPress={handleSubmit(onUpdate)}
              >
                <Text className="text-white text-center font-bold">
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* password */}
        {section === "password" && (
          <View className="bg-white rounded-3xl p-5 mt-5">
            <Text className="text-xl font-bold mb-4">Cambiar contraseña</Text>

            <Controller
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <TextInput
                  secureTextEntry
                  placeholder="Nueva contraseña"
                  className="border rounded-xl p-4 mb-2"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />

            <Controller
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <TextInput
                  secureTextEntry
                  placeholder="Confirmar contraseña"
                  className="border rounded-xl p-4"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />

            <View className="flex-row gap-3 mt-5">
              <TouchableOpacity
                className="flex-1 bg-neutral-300 rounded-xl p-4"
                onPress={cancelPasswordEdition}
              >
                <Text className="text-center font-bold">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-xl p-4"
                onPress={passwordForm.handleSubmit(onPasswordUpdate)}
              >
                <Text className="text-white text-center font-bold">
                  Actualizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
