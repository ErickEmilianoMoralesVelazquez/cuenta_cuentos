import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ onPress, title, variant = 'primary', disabled }: ButtonProps) {
  const backgroundColor = useThemeColor({}, 'tint');
  const textColor = variant === 'primary' ? '#fff' : backgroundColor;

  return (
    <Animated.View entering={FadeIn}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          variant === 'primary' && { backgroundColor },
          variant === 'secondary' && styles.buttonOutline,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}>
        <ThemedText
          style={[
            styles.text,
            { color: textColor },
            disabled && styles.disabledText,
          ]}>
          {title}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
});
