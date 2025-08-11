import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { useCallback } from "react";

interface CustomSplashScreenProps {
  onAnimationFinish?: () => void;
}

export default function CustomSplashScreen({
  onAnimationFinish,
}: CustomSplashScreenProps) {
  const handleAnimationFinish = useCallback(() => {
    console.log('Lottie animation finished'); // Para debug
    onAnimationFinish?.();
  }, [onAnimationFinish]);

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
