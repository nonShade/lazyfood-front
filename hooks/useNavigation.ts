import { router } from 'expo-router';

export const useNavigation = () => {
  const navigateToScanner = () => {
    router.push('/scanner');
  };

  const navigateToHome = () => {
    router.push('/home');
  };

  const navigateToPlanner = () => {
    router.push('/planner');
  };

  const navigateToRecipes = () => {
    
  };

  const navigateToProfile = () => {
    
  };

  const getNavigationItems = (activeRoute: 'home' | 'recipes' | 'planner' | 'profile') => [
    {
      id: 'home',
      icon: 'home',
      label: 'Inicio',
      isActive: activeRoute === 'home',
      onPress: navigateToHome,
    },
    {
      id: 'recipes',
      icon: 'book-open',
      label: 'Recetas',
      isActive: activeRoute === 'recipes',
      onPress: navigateToRecipes,
    },
    {
      id: 'planner',
      icon: 'calendar',
      label: 'Calendario',
      isActive: activeRoute === 'planner',
      onPress: navigateToPlanner,
    },
    {
      id: 'profile',
      icon: 'user',
      label: 'Perfil',
      isActive: activeRoute === 'profile',
      onPress: navigateToProfile,
    },
  ];

  return {
    navigateToScanner,
    navigateToHome,
    navigateToPlanner,
    navigateToRecipes,
    navigateToProfile,
    getNavigationItems,
  };
};