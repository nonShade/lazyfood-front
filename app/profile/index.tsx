import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import DeleteAccountModal from '../../components/profile/DeleteAccountModal';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/theme';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  const { profile, isLoading, error, refreshProfile } = useProfile();
  const { logout } = useAuth();

  const handleConfirmDelete = () => {
    setModalVisible(false);
    Alert.alert(
      'Cuenta eliminada',
      'Tu cuenta ha sido eliminada exitosamente',
      [{ text: 'OK', onPress: () => router.replace('/') }]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/Login' as any);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Capitalizar primera letra
  const capitalize = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Mapear nivel de cocina a texto
  const getNivelCocinaText = (nivel: number) => {
    switch (nivel) {
      case 1: return 'Principiante';
      case 2: return 'Intermedio';
      case 3: return 'Avanzado';
      default: return 'Principiante';
    }
  };

  const lastRefreshRef = React.useRef<number>(0);

  // Recargar perfil cuando la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      // Solo recargar si han pasado más de 2 segundos desde la última vez y no está cargando
      if (!isLoading && now - lastRefreshRef.current > 2000) {
        lastRefreshRef.current = now;
        refreshProfile().catch(err => {
          console.error('Error refreshing profile:', err);
        });
      }
    }, [refreshProfile, isLoading])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>😕 Error al cargar perfil</Text>
        <Text style={styles.errorSubtext}>{error || 'No se pudo cargar la información'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Perfil</Text>

        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profile.nombre)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile.nombre}</Text>
            <Text style={styles.email}>{profile.correo}</Text>
            <Text style={styles.level}>Nivel: {getNivelCocinaText(profile.nivel_cocina)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferencias alimenticias</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {capitalize(profile.preferencias?.dieta || 'omnívora')}
              </Text>
            </View>
            {(profile.preferencias?.alergias && profile.preferencias.alergias.length > 0
              ? profile.preferencias.alergias
              : ['Sin alergias']
            ).map((alergia, index) => (
              <View key={`${alergia}-${index}`} style={[styles.badge, { backgroundColor: '#D1FAE5', marginLeft: 8 }]}>
                <Text style={[styles.badgeText, { color: '#065F46' }]}>{capitalize(alergia)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meta nutricional</Text>
          <Text style={styles.cardSub}>
            {profile.metas_nutricionales || 'Mantener salud general'}
          </Text>
        </View>

        {profile.preferencias?.gustos && profile.preferencias.gustos.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gustos alimentarios</Text>
            <View style={styles.badgesRow}>
              {profile.preferencias.gustos.map((gusto, index) => (
                <View key={`${gusto}-${index}`} style={[styles.badge, { backgroundColor: '#DBEAFE', marginBottom: 8 }]}>
                  <Text style={[styles.badgeText, { color: '#1E40AF' }]}>{gusto}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/profile/edit-preferences' as any)}>
          <Text style={styles.actionText}>Editar preferencias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.blackBtn]}
          onPress={handleLogout}
        >
          <Text style={[styles.actionText, { color: '#FFF' }]}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => setModalVisible(true)}>
          <Text style={[styles.actionText, { color: '#FFF' }]}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </ScrollView>

      <DeleteAccountModal
        visible={modalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 12,
  },
  actionText: {
    color: '#111827',
    fontWeight: '700',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 36,
    height: 72,
    justifyContent: 'center',
    marginRight: 12,
    width: 72,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#FDE68A',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  blackBtn: {
    backgroundColor: '#000',
    borderWidth: 0,
  },
  card: {
    backgroundColor: '#FEF3E0',
    borderRadius: 10,
    marginBottom: 12,
    padding: 14,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardSub: {
    color: '#6B7280',
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  deleteBtn: {
    backgroundColor: '#C2410C',
    borderWidth: 0,
  },
  email: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 2,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  level: {
    color: '#6B7280',
    marginTop: 2,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  smallCard: {
    alignItems: 'center',
    backgroundColor: '#FEF3E0',
    borderRadius: 10,
    flex: 1,
    padding: 12,
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 12,
  },
  statNumber: {
    color: '#C2410C',
    fontSize: 20,
    fontWeight: '800',
  },
});

export default ProfileScreen;