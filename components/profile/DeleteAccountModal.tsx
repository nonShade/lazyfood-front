import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconPlaceholder} />
          <Text style={styles.title}>¿Eliminar mi cuenta?</Text>
          <Text style={styles.desc}>Esta acción es irreversible. Se eliminarán todos tus datos almacenados.</Text>

          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmText}>Sí, eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  card: { width: 320, backgroundColor: '#FFF8F0', borderRadius: 12, padding: 20, alignItems: 'center' },
  iconPlaceholder: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#F87171', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 18 },
  confirmBtn: { width: '100%', backgroundColor: '#B91C1C', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  confirmText: { color: '#FFF', fontWeight: '700' },
  cancelBtn: { width: '100%', backgroundColor: '#F59E0B', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelText: { color: '#111827', fontWeight: '700' },
});

export default DeleteAccountModal;
