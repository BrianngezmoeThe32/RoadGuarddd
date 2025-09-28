import { Service } from '../types';
import { SERVICE_COLORS } from './colors';

export const SERVICES: Service[] = [
  {
    id: 1,
    name: 'Out of Gas',
    icon: '⛽',
    description: 'We\'ll bring fuel to your location',
    color: SERVICE_COLORS.gas,
    iconName: 'local-gas-station'
  },
  {
    id: 2,
    name: 'Tire Change',
    icon: '🔧',
    description: 'Flat tire assistance',
    color: SERVICE_COLORS.tire,
    iconName: 'build'
  },
  {
    id: 3,
    name: 'Jump Start',
    icon: '🔋',
    description: 'Battery jump start service',
    color: SERVICE_COLORS.battery,
    iconName: 'battery-charging-full'
  },
  {
    id: 4,
    name: 'Lockout Service',
    icon: '🔑',
    description: 'Locked out of your vehicle?',
    color: SERVICE_COLORS.lock,
    iconName: 'lock'
  },
  {
    id: 5,
    name: 'Towing',
    icon: '🚛',
    description: 'Vehicle towing services',
    color: SERVICE_COLORS.towing,
    iconName: 'local-shipping'
  },
  {
    id: 6,
    name: 'Other Assistance',
    icon: '❓',
    description: 'Other roadside issues',
    color: SERVICE_COLORS.other,
    iconName: 'help'
  },
];