import { router } from 'expo-router';

export const useNavigation = () => {
  const getNavigationItems = (activeRoute: 'home' | 'inventory' | 'planner' | 'profile') => [
    {
      id: 'home',
      icon: 'home',
      label: 'Inicio',
      isActive: activeRoute === 'home',
      onPress: () => router.push('/home'),
    },
    {
      id: 'inventory',
      icon: 'package',
      label: 'Inventario',
      isActive: activeRoute === 'inventory',
      onPress: () => router.push('/inventory'),
    },
    {
      id: 'planner',
      icon: 'calendar',
      label: 'Calendario',
      isActive: activeRoute === 'planner',
      onPress: () => router.push('/planner'),
    },
    {
      id: 'profile',
      icon: 'user',
      label: 'Perfil',
      isActive: activeRoute === 'profile',
      onPress: () => {}, // TODO: Crear ruta /profile
    },
  ];

  return {
    getNavigationItems,
    navigateToScanner: () => router.push('/scanner'),
  };
};