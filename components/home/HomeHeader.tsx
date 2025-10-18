import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  userName?: string;
  onProfilePress?: () => void;
}

const HomeHeader: React.FC<Props> = ({ userName = 'María', onProfilePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <Text style={styles.greeting}>¡Hola, {userName}!</Text>
        <Text style={styles.subtitle}>¿Qué cocinamos hoy?</Text>
      </View>

      <TouchableOpacity style={styles.avatarWrap} onPress={onProfilePress}>
        <View style={styles.avatarPlaceholder}>
          <Feather name="user" size={20} color="#FFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  texts: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 2,
  },
  avatarWrap: {},
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeHeader;
