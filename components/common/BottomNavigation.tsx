import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface NavigationItem {
  id: string;
  icon: string;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

interface BottomNavigationProps {
  items: NavigationItem[];
  onScannerPress?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ items, onScannerPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.navItem, item.isActive && styles.navItemActive]}
            onPress={item.onPress}
          >
            <Feather
              name={item.icon as any}
              size={24}
              color={item.isActive ? '#D97706' : '#9CA3AF'}
            />
            <Text
              style={[
                styles.navText,
                item.isActive && styles.navTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {onScannerPress && (
        <TouchableOpacity style={styles.fab} onPress={onScannerPress}>
          <Feather name="camera" size={28} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 10,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navItemActive: {},
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  navTextActive: {
    color: '#D97706',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 85,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default BottomNavigation;
