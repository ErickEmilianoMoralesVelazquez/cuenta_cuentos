import { StyleSheet, View, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { useState } from 'react';
import { router } from 'expo-router';

import { FormInput } from '@/components/auth/FormInput';
import { Button } from '@/components/auth/Button';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FormData {
  name: string;
  age: string;
  email: string;
  password: string;
  nickname: string;
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    email: '',
    password: '',
    nickname: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const backgroundColor = useThemeColor({}, 'background');

  const validateStep = () => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.name) {
          newErrors.name = 'El nombre es requerido';
        }
        break;
      case 2:
        if (!formData.age || isNaN(Number(formData.age))) {
          newErrors.age = 'Ingresa una edad válida';
        }
        break;
      case 3:
        if (!formData.email) {
          newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Ingresa un correo válido';
        }
        if (!formData.password) {
          newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        break;
      case 4:
        if (!formData.nickname) {
          newErrors.nickname = 'El sobrenombre es requerido';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        // Aquí iría la lógica para enviar los datos al servidor
        console.log('Datos del formulario:', formData);
        router.replace('/login');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View 
            entering={FadeInUp} 
            exiting={FadeOutDown}
            style={styles.step}
          >
            <ThemedText style={styles.title}>¿Cómo te llamas?</ThemedText>
            <FormInput
              label="Nombre completo"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              error={errors.name}
              autoFocus
            />
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View 
            entering={FadeInUp} 
            exiting={FadeOutDown}
            style={styles.step}
          >
            <ThemedText style={styles.title}>¿Cuál es tu edad?</ThemedText>
            <FormInput
              label="Edad"
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              error={errors.age}
              keyboardType="number-pad"
              autoFocus
            />
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View 
            entering={FadeInUp} 
            exiting={FadeOutDown}
            style={styles.step}
          >
            <ThemedText style={styles.title}>Datos de acceso</ThemedText>
            <FormInput
              label="Correo electrónico"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
            <FormInput
              label="Contraseña"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              error={errors.password}
              secureTextEntry
            />
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View 
            entering={FadeInUp} 
            exiting={FadeOutDown}
            style={styles.step}
          >
            <ThemedText style={styles.title}>¿Cómo te gustaría que te llamemos?</ThemedText>
            <FormInput
              label="Sobrenombre"
              value={formData.nickname}
              onChangeText={(text) => setFormData({ ...formData, nickname: text })}
              error={errors.nickname}
              autoFocus
            />
          </Animated.View>
        );
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
            <View style={styles.content}>
              <View style={styles.progress}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      index < step && styles.progressDotActive,
                    ]}
                  />
                ))}
              </View>

              {renderStep()}

              <View style={styles.buttons}>
                {step > 1 && (
                  <Button
                    title="Atrás"
                    onPress={handleBack}
                    variant="secondary"
                  />
                )}
                <Button
                  title={step === 4 ? 'Finalizar' : 'Siguiente'}
                  onPress={handleNext}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  step: {
    flex: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttons: {
    marginTop: 'auto',
  },
});
