import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import CustomSplashScreen from '@/components/CustomSplashScreen';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mantener el splash screen visible mientras cargamos los recursos
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        if (loaded) {
          // Asegurarse de que el splash screen nativo se oculte
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [loaded]);

  const handleAnimationFinish = useCallback(() => {
    console.log('Animation finished'); // Para debug
    setIsLoading(false);
    // Redirigir a la pantalla de registro después de un pequeño delay
    setTimeout(() => {
      router.replace('/(auth)/login');
      // router.replace('/');
    }, 100);
  }, []);

  // Si las fuentes no están cargadas, mostramos null
  if (!loaded) {
    return null;
  }

  // Si estamos cargando, mostramos el splash screen personalizado
  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <CustomSplashScreen onAnimationFinish={handleAnimationFinish} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" options={{ headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
