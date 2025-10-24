import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeleteAccountModal from '../../components/profile/DeleteAccountModal';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [prefs, setPrefs] = React.useState<{ diet?: string; allergies?: string[]; likes?: string[] } | null>(null);

  const handleConfirmDelete = () => {
    setModalVisible(false);
    router.replace('/');
  };

  React.useEffect(() => {
    let mounted = true;
    let unsub: (() => void) | null = null;
    import('../../services/storage/preferences').then(mod => {
      if (!mounted) return;
      setPrefs(mod.getPreferences());
      unsub = mod.subscribePreferences((p: any) => setPrefs(p));
    });
    return () => {
      mounted = false;
      if (unsub) unsub();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Perfil</Text>

        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MR</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Chef: Maria</Text>
            <Text style={styles.level}>Nivel: Principiante</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferencias alimenticias</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{prefs?.diet ?? 'Omnívora'}</Text>
            </View>
            {(prefs?.allergies ?? ['Sin alergias']).map(a => (
              <View key={a} style={[styles.badge, { backgroundColor: '#D1FAE5', marginLeft: 8 }]}>
                <Text style={[styles.badgeText, { color: '#065F46' }]}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meta nutricional</Text>
          <Text style={styles.cardSub}>Mantener salud general</Text>
        </View>

        <View style={styles.cardRow}>
          <View style={[styles.smallCard, { marginRight: 8 }]}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Recetas cocinadas</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>8</Text>
            <Text style={styles.statLabel}>Días activo</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/profile/edit-preferences' as any)}>
          <Text style={styles.actionText}>Editar preferencias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.blackBtn]}
          onPress={() => router.replace('/(auth)/Login' as any)}
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
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  deleteBtn: {
    backgroundColor: '#C2410C',
    borderWidth: 0,
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