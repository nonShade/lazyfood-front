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
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ items }) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default BottomNavigation;