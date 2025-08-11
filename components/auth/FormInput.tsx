import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormInput({ label, error, ...props }: FormInputProps) {
  const inputBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  return (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      style={styles.container}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: inputBackground, color: textColor, borderColor },
          error ? styles.inputError : null,
        ]}
        placeholderTextColor="#666"
        {...props}
      />
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff375f',
  },
  errorText: {
    color: '#ff375f',
    fontSize: 14,
    marginTop: 4,
  },
});
