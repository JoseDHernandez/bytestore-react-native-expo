import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

type Props = {
  qualification: number;
  size?: number;
  className?: string;
};

export default function Score({ qualification, size = 20 }: Props) {
  const score = Math.max(0, Math.min(5, qualification));

  const starsFull = Math.floor(score);

  const hasHalf = score % 1 >= 0.25 && score % 1 < 0.75;

  const extraFull = score % 1 >= 0.75 ? 1 : 0;

  const totalFull = starsFull + extraFull;

  const totalStars = hasHalf ? totalFull + 1 : totalFull;

  const emptyStars = 5 - totalStars;

  return (
    <View className="flex-row gap-1">
      {Array.from({
        length: totalFull,
      }).map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={size} color="#FACC15" />
      ))}

      {hasHalf && <Ionicons name="star-half" size={size} color="#FACC15" />}

      {Array.from({
        length: emptyStars,
      }).map((_, i) => (
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={size}
          color="#FACC15"
        />
      ))}
    </View>
  );
}
