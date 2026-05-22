import { useAuth } from "@/hooks/useAuth";
import { Button, Text, View } from "react-native";
export default function Profile() {
  const { logout } = useAuth();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Profile</Text>
      <Button title="Log out" onPress={() => logout()} />
    </View>
  );
}
