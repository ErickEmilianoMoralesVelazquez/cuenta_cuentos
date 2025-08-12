import { StyleSheet, View, Platform } from "react-native";
import { useCallback } from "react";

let LottieView: any = null;
if (Platform.OS !== "web") {
  LottieView = require("lottie-react-native").default;
}

interface CustomSplashScreenProps {
  onAnimationFinish?: () => void;
}

export default function CustomSplashScreen({
  onAnimationFinish,
}: CustomSplashScreenProps) {
  const handleAnimationFinish = useCallback(() => {
    console.log("Lottie animation finished");
    onAnimationFinish?.();
  }, [onAnimationFinish]);

  // Si es web, no renderiza la animación
  if (Platform.OS === "web") {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/Books.json")}
        autoPlay
        loop={false}
        speed={1.0}
        onAnimationFinish={handleAnimationFinish}
        style={styles.animation}
        renderMode="AUTOMATIC"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3E8FF",
  },

  animation: {
    width: 350,
    height: 350,
  },
});
