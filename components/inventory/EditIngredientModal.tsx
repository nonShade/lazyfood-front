import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type EditIngredientModalProps = {
    visible: boolean;
    ingredient: {
        id: string;
        name: string;
        category: string;
        icon: string;
        quantity: number;
    } | null;
    onClose: () => void;
    onSave: (ingredient: any) => void;
    onDelete: (ingredient: any) => void;
};

const EditIngredientModal = ({ visible, ingredient, onClose, onSave, onDelete }: EditIngredientModalProps) => {
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (ingredient) {
            setQuantity(ingredient.quantity);
        }
    }, [ingredient]);

    const handleSave = () => {
        if (ingredient) {
            onSave({ ...ingredient, quantity });
        }
    };

    if (!ingredient) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Editar Ingrediente</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ingredientHeader}>
                        <Text style={styles.ingredientIcon}>{ingredient.icon}</Text>
                        <View>
                            <Text style={styles.ingredientName}>{ingredient.name}</Text>
                            <Text style={styles.ingredientCategory}>{ingredient.category}</Text>
                        </View>
                    </View>

                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Cantidad</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(0, quantity - 1))}
                            >
                                <Text style={styles.quantityButtonText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityValue}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.quantityUnit}>unidades</Text>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => onDelete(ingredient)}
                    >
                        <Feather name="trash-2" size={18} color="#E53935" />
                        <Text style={styles.deleteButtonText}>Eliminar Ingrediente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    ingredientHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    ingredientIcon: {
        fontSize: 40,
        marginRight: 16,
    },
    ingredientName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    ingredientCategory: {
        fontSize: 14,
        color: '#666',
    },
    quantitySection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    quantityLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 8,
    },
    quantityButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 24,
        color: '#666',
    },
    quantityValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        minWidth: 60,
        textAlign: 'center',
    },
    quantityUnit: {
        fontSize: 14,
        color: '#999',
    },
    saveButton: {
        backgroundColor: '#C17A3A',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        flexDirection: 'row',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },
    deleteButtonText: {
        color: '#E53935',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});

export default EditIngredientModal;