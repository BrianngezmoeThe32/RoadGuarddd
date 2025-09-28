import { StyleProp, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type IconName = 'home' | 'menu' | 'search'; // <-- list all allowed names here

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}
