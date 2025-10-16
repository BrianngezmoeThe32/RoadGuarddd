import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS } from "../../constants/colors";

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const isIconOnly = icon && !title;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderWidth: variant === "outline" ? 1 : 0,
    };

    if (isIconOnly) {
      // Special style for round icon-only buttons
      return {
        ...baseStyle,
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: "#E5E5E5",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        padding: 0,
        ...style,
      };
    }

    // Otherwise, normal size and variant styles
    const sizeStyles: { [key in typeof size]: ViewStyle } = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 36,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minHeight: 48,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        minHeight: 56,
      },
    };

    const variantStyles: { [key in typeof variant]: ViewStyle } = {
      primary: {
        backgroundColor: disabled ? COLORS.gray : COLORS.primary,
      },
      secondary: {
        backgroundColor: disabled ? COLORS.gray : COLORS.secondary,
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: disabled ? COLORS.gray : COLORS.primary,
      },
      text: {
        backgroundColor: "transparent",
        paddingVertical: 8,
        paddingHorizontal: 12,
        minHeight: "auto" as any,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    };

    const variantTextStyles: { [key in typeof variant]: TextStyle } = {
      primary: {
        color: COLORS.white,
      },
      secondary: {
        color: COLORS.white,
      },
      outline: {
        color: disabled ? COLORS.gray : COLORS.primary,
      },
      text: {
        color: disabled ? COLORS.gray : COLORS.primary,
        fontSize: 14,
        fontWeight: "500",
      },
    };

    const sizeTextStyles: { [key in typeof size]: TextStyle } = {
      small: {
        fontSize: 14,
      },
      medium: {
        fontSize: 16,
      },
      large: {
        fontSize: 18,
      },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
      ...sizeTextStyles[size],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "secondary"
              ? COLORS.white
              : COLORS.primary
          }
        />
      ) : (
        <>
          {icon && icon}
          {title ? <Text style={getTextStyle()}>{title}</Text> : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Button;
