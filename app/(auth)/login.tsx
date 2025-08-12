import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity, // 👈 nuevo
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Link, router } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";

import { FormInput } from "@/components/auth/FormInput";
import { Button } from "@/components/auth/Button";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol"; // 👈 nuevo

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 nuevo

  const backgroundColor = useThemeColor({}, "background");
  const baseURL = "https://96e3458c9b70.ngrok-free.app";

  const validateForm = () => {
    const newErrors: Partial<LoginForm> = {};
    if (!formData.email) newErrors.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Ingresa un correo válido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          (typeof data === "object" && (data.message || data.error)) ||
          "Credenciales inválidas";
        throw new Error(msg);
      }

      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));

      Alert.alert("¡Bienvenido!", "Inicio de sesión exitoso.");
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInUp} style={styles.content}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("@/assets/icons/icon_mobile_remove.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.title}>Bienvenido de nuevo</Text>

              <FormInput
                label="Correo electrónico"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
              />

              <FormInput
                label="Contraseña"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                error={errors.password}
                secureTextEntry={!showPassword} // 👈 cambia según estado
                rightIcon={
                  // 👈 icono al final del input
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                    <IconSymbol
                      name={showPassword ? "eye.slash" : "eye"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                }
              />

              <Button
                title={loading ? "Entrando..." : "Iniciar sesión"}
                onPress={handleLogin}
                disabled={loading}
              />
              {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

              <View style={styles.registerContainer}>
                <ThemedText>¿No tienes una cuenta? </ThemedText>
                <Link href="/(auth)/register" asChild>
                  <ThemedText style={styles.registerLink}>
                    Regístrate
                  </ThemedText>
                </Link>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 20,
    marginTop: Platform.select({ ios: 40, android: 20 }),
    justifyContent: "center",
  },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  logo: { width: 120, height: 120 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  registerLink: { color: "#007AFF", fontWeight: "600" },
});
