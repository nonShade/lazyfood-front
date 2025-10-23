import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

interface DeleteAccountModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalColors = {
  textDark: '#1F2937',
  textMuted: '#6B7280',
  deleteRed: '#B91C1C',
  deleteRedBg: '#EF4444',
  trashBg: '#FEE2E2',
  cancelBg: '#4B5563',
};

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContent}>
          <View style={styles.trashIconContainer}>
            <Feather name="trash-2" size={48} color={ModalColors.deleteRed} />
          </View>

          <Text style={styles.modalTitle}>¿Eliminar mi cuenta?</Text>
          <Text style={styles.modalDescription}>Esta acción es irreversible. Se eliminarán todos tus datos almacenados.</Text>

          <TouchableOpacity 
            style={[styles.modalButton, styles.modalDeleteButton]} 
            onPress={onConfirm}
          >
            <Text style={styles.modalButtonText}>Sí, eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modalButton, styles.modalCancelButton]} 
            onPress={onCancel}
          >
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 25,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  trashIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ModalColors.trashBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: ModalColors.textDark,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: ModalColors.textMuted,
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 20,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalDeleteButton: {
    backgroundColor: ModalColors.deleteRedBg,
  },
  modalCancelButton: {
    backgroundColor: Colors.light.primary,
    marginTop: 10,
  },
});

export default DeleteAccountModal;
