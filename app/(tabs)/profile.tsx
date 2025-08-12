import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

type LoadedUser = {
  name: string;
  email: string;
  nickname?: string;
};

function formatJoinDateES(date: Date) {
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  return `${meses[date.getMonth()]} ${date.getFullYear()}`;
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: "Pequeño Explorador",
    email: "explorador@mail.com",
    joinDate: "Agosto 2023",
    alias: "explorador anónimo",
  });

  useEffect(() => {
    (async () => {
      try {
        const rawUser = await SecureStore.getItemAsync("user");
        const storedJoin = await SecureStore.getItemAsync("joinDate");

        let joinDate = storedJoin ?? "";
        if (!joinDate) {
          // Primera vez que entra al perfil: fija y persiste el joinDate
          joinDate = formatJoinDateES(new Date());
          await SecureStore.setItemAsync("joinDate", joinDate);
        }

        if (rawUser) {
          const u: LoadedUser = JSON.parse(rawUser);
          setUserInfo({
            name: u.name,
            email: u.email,
            alias: u.nickname ?? "sin_alias",
            joinDate,
          });
        } else {
          // Si no hay usuario guardado, opcionalmente redirigir a login
          // router.replace("/(auth)/login");
        }
      } catch (e) {
        // En caso de error, mantenemos los valores por defecto
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
       <SafeAreaView style={styles.safeArea} edges={['top']}>
         <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
           <Text>Cargando perfil…</Text>
         </View>
       </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <IconSymbol name="person.fill" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userSubtitle}>¡Bienvenido!</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.infoItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="person" size={24} color="#666" />
              <View>
                <Text style={styles.infoLabel}>Alias</Text>
                <Text style={styles.infoValue}>{userInfo.alias}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="envelope" size={24} color="#666" />
              <View>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{userInfo.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="calendar" size={24} color="#666" />
              <View>
                <Text style={styles.infoLabel}>Miembro desde</Text>
                <Text style={styles.infoValue}>{userInfo.joinDate}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.logoutSection]}>
          <TouchableOpacity
            style={[styles.settingButton, styles.logoutButton]}
            onPress={async () => {
              await SecureStore.deleteItemAsync("token");
              await SecureStore.deleteItemAsync("user");
              await SecureStore.deleteItemAsync("joinDate");
              router.replace("/(auth)/login");
            }}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#FF6B6B" />
            <Text style={[styles.settingText, styles.logoutText]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4ECDC4",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 20,
  },
  settingButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
  },
  infoItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 15,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    fontWeight: "500",
  },
  logoutSection: {
    marginTop: 40,
  },
  logoutButton: {
    backgroundColor: "#FFF0F0",
  },
  logoutText: {
    color: "#FF6B6B",
  },
});
