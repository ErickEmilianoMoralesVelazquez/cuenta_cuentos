import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useColorScheme } from "@/hooks/useColorScheme"
import { router } from 'expo-router';

export default function Profile() {
  const [darkMode, setDarkMode] = React.useState(false)
  const [notifications, setNotifications] = React.useState(true)
  const colorScheme = useColorScheme()

  const userStats = {
    storiesListened: 12,
    favoriteStories: 5,
    totalTime: "2h 30min",
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
          <Text style={styles.userName}>Pequeño Explorador</Text>
          <Text style={styles.userSubtitle}>¡Sigue explorando historias!</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.storiesListened}</Text>
            <Text style={styles.statLabel}>Historias Escuchadas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.favoriteStories}</Text>
            <Text style={styles.statLabel}>Favoritas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.totalTime}</Text>
            <Text style={styles.statLabel}>Tiempo Total</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="moon" size={24} color="#666" />
              <Text style={styles.settingText}>Modo Oscuro</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#E0E0E0", true: "#4ECDC4" }}
              thumbColor={darkMode ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="bell" size={24} color="#666" />
              <Text style={styles.settingText}>Notificaciones</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#E0E0E0", true: "#4ECDC4" }}
              thumbColor={notifications ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <TouchableOpacity style={styles.settingButton}>
            <IconSymbol name="speaker.wave.2" size={24} color="#666" />
            <Text style={styles.settingText}>Control de Volumen</Text>
            <IconSymbol name="chevron.right" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <IconSymbol name="timer" size={24} color="#666" />
            <Text style={styles.settingText}>Temporizador de Sueño</Text>
            <IconSymbol name="chevron.right" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayuda y Soporte</Text>

          <TouchableOpacity style={styles.settingButton}>
            <IconSymbol name="questionmark.circle" size={24} color="#666" />
            <Text style={styles.settingText}>Ayuda</Text>
            <IconSymbol name="chevron.right" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <IconSymbol name="envelope" size={24} color="#666" />
            <Text style={styles.settingText}>Contactar Soporte</Text>
            <IconSymbol name="chevron.right" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, styles.logoutSection]}>
          <TouchableOpacity 
            style={[styles.settingButton, styles.logoutButton]}
            onPress={() => {
              // Aquí puedes agregar la lógica para limpiar el estado de la aplicación
              // Por ejemplo, limpiar el token de autenticación, datos del usuario, etc.
              router.replace('/(auth)/login');
            }}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#FF6B6B" />
            <Text style={[styles.settingText, styles.logoutText]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4ECDC4", // Mismo color del header para continuidad
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 120, // Espacio suficiente para scroll completo y tab bar
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
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
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
  },
  settingItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  logoutSection: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#FFF0F0",
  },
  logoutText: {
    color: "#FF6B6B",
  },
})