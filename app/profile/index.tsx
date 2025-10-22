import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeleteAccountModal from '../../components/profile/DeleteAccountModal';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);


  const handleConfirmDelete = () => {
    setModalVisible(false);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Perfil</Text>

        <View style={styles.headerRow}>
          <View style={styles.avatar}> <Text style={styles.avatarText}>MR</Text> </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Chef: Maria</Text>
            <Text style={styles.level}>Nivel: Principiante</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferencias alimenticias</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>Omnívora</Text></View>
            <View style={[styles.badge, { backgroundColor: '#D1FAE5' }]}><Text style={[styles.badgeText, { color: '#065F46' }]}>Sin alergias</Text></View>
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

        <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>Editar preferencias</Text></TouchableOpacity>
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

      <DeleteAccountModal visible={modalVisible} onConfirm={handleConfirmDelete} onCancel={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 140 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#F59E0B', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFF', fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '700' },
  level: { color: '#6B7280' },
  card: { backgroundColor: '#FEF3E0', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardTitle: { fontWeight: '700', marginBottom: 8 },
  cardSub: { color: '#6B7280' },
  badgesRow: { flexDirection: 'row', gap: 8 },
  badge: { backgroundColor: '#FDE68A', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 12, color: '#92400E', fontWeight: '600' },
  cardRow: { flexDirection: 'row', marginBottom: 12 },
  smallCard: { flex: 1, backgroundColor: '#FEF3E0', borderRadius: 10, padding: 12, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#C2410C' },
  statLabel: { color: '#6B7280', fontSize: 12 },
  actionBtn: { backgroundColor: '#FFF', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  actionText: { color: '#111827', fontWeight: '700' },
  blackBtn: { backgroundColor: '#000', borderWidth: 0 },
  deleteBtn: { backgroundColor: '#C2410C', borderWidth: 0 },
});

export default ProfileScreen;