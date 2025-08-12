import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  rightIcon?: React.ReactNode; // 👈 nuevo
}

export function FormInput({ label, error, rightIcon, style, ...props }: FormInputProps) {
  const inputBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  const hasRight = !!rightIcon;

  return (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      style={styles.container}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBackground, color: textColor, borderColor },
            hasRight && { paddingRight: 44 },  // 👈 espacio para el icono
            error ? styles.inputError : null,
            style,
          ]}
          placeholderTextColor="#666"
          {...props}
        />
        {hasRight && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },

  inputRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
  },

  rightIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputError: { borderColor: '#ff375f' },
  errorText: { color: '#ff375f', fontSize: 14, marginTop: 4 },
});
