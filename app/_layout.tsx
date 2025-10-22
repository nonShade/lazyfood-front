import { Stack, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import BottomNavigation from '../components/common/BottomNavigation';
import { useNavigation } from '../hooks/useNavigation';

export default function RootLayout() {
  const pathname = usePathname();
  const { getNavigationItems, navigateToScanner } = useNavigation();

  const getActiveRoute = (): 'home' | 'inventory' | 'planner' | 'profile' => {
    if (pathname.includes('/home')) return 'home';
    if (pathname.includes('/planner')) return 'planner';
    if (pathname.includes('/inventory')) return 'inventory';
    if (pathname.includes('/profile')) return 'profile';
    return 'home';
  };

  const shouldShowBottomNav = () => {
    const routesWithBottomNav = ['/home', '/planner', '/inventory', '/profile'];
    const routesWithoutBottomNav = ['/', '/(auth)/Login'];

    if (routesWithoutBottomNav.includes(pathname) || pathname.includes('(auth)') || pathname.includes('onboarding')) {
      return false;
    }

    return routesWithBottomNav.some(route => pathname.includes(route));
  };

  const navigationItems = getNavigationItems(getActiveRoute());

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home/index" />
        <Stack.Screen name="planner/index" />
        <Stack.Screen name="inventory/index" />
        <Stack.Screen name="scanner/index" />
        <Stack.Screen name="recipe/recipe" />
        <Stack.Screen name="(auth)/Login" />
      </Stack>

      {shouldShowBottomNav() && (
        <BottomNavigation
          items={navigationItems}
          onScannerPress={navigateToScanner}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
