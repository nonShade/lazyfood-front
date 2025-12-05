import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type AddIngredientItemProps = {
    name: string;
    category: string;
    icon: string;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
};

const AddIngredientItem = ({ name, category, icon, quantity, onIncrease, onDecrease }: AddIngredientItemProps) => (
    <View style={styles.addItem}>
        <View style={styles.addItemLeft}>
            <Text style={styles.addItemIcon}>{icon}</Text>
            <View>
                <Text style={styles.addItemName}>{name}</Text>
                <Text style={styles.addItemCategory}>{category}</Text>
            </View>
        </View>
        <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
                <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
                <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    </View>
);

type AddIngredientModalProps = {
    visible: boolean;
    onClose: () => void;
    onAdd: (ingredients: any[]) => void;
    existingIngredients: Array<{
        id: string;
        name: string;
        category: string;
        icon: string;
        unit: string;
    }>;
};

const AddIngredientModal = ({ visible, onClose, onAdd, existingIngredients }: AddIngredientModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const filteredIngredients = existingIngredients.filter((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleIncrease = (id: any) => {
        setQuantities((prev: any) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const handleDecrease = (id: any) => {
        setQuantities((prev: any) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
    };

    const handleAdd = () => {
        const selectedIngredients = Object.entries(quantities)
            .filter(([_, qty]) => qty as any > 0)
            .map(([id, qty]) => {
                const ing = existingIngredients.find((i) => i.id === id);
                return { ...ing, quantity: qty };
            });

        if (selectedIngredients.length > 0) {
            onAdd(selectedIngredients);
            setQuantities({});
            setSearchQuery('');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Agregar Ingrediente</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Feather name="search" size={20} color="#999" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar ingrediente..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <ScrollView style={styles.ingredientList}>
                        {filteredIngredients.length === 0 ? (
                            <View style={styles.emptyState}>
                                {existingIngredients.length === 0 ? (
                                    <Text style={styles.emptyStateText}>
                                        No tienes ingredientes en tu inventario.{'\n'}
                                        Usa el scanner para agregar ingredientes automáticamente.
                                    </Text>
                                ) : (
                                    <Text style={styles.emptyStateText}>
                                        No se encontraron ingredientes con "{searchQuery}"
                                    </Text>
                                )}
                            </View>
                        ) : (
                            filteredIngredients.map((ingredient: any) => (
                                <AddIngredientItem
                                    key={ingredient.id}
                                    name={ingredient.name}
                                    category={ingredient.category}
                                    icon={ingredient.icon}
                                    quantity={quantities[ingredient.id] || 0}
                                    onIncrease={() => handleIncrease(ingredient.id)}
                                    onDecrease={() => handleDecrease(ingredient.id)}
                                />
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                            <Text style={styles.addButtonText}>Agregar</Text>
                        </TouchableOpacity>
                    </View>
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
        maxHeight: '80%',
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#000',
    },
    ingredientList: {
        maxHeight: 400,
    },
    addItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    addItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    addItemIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    addItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    addItemCategory: {
        fontSize: 12,
        color: '#666',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 20,
        color: '#666',
    },
    quantityValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        minWidth: 24,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        marginBottom: 20,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#C17A3A',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default AddIngredientModal;