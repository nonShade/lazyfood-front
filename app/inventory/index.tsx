import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavigation from '../../components/common/BottomNavigation';
import AddIngredientModal from '../../components/inventory/AddIngredientModal';
import EditIngredientModal from '../../components/inventory/EditIngredientModal';
import IngredientCard from '../../components/inventory/IngredientCard';
import { useInventory } from '../../hooks/useInventory';

const Inventory = () => {
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    const { ingredients, addIngredients, updateIngredient, deleteIngredient } = useInventory('user123');

    const handleScannerPress = () => {
        // Scanner functionality
    };

    const navigationItems = [
        { id: 'home', icon: 'home', label: 'Inicio', isActive: false, onPress: () => router.push('/home') },
        { id: 'inventory', icon: 'package', label: 'Inventario', isActive: true, onPress: () => { } },
        { id: 'planner', icon: 'calendar', label: 'Calendario', isActive: false, onPress: () => router.push('/planner') },
        { id: 'profile', icon: 'user', label: 'Perfil', isActive: false, onPress: () => { } },
    ];

    const handleAddIngredients = (newIngredients: any) => {
        addIngredients(newIngredients);
        setAddModalVisible(false);
    };

    const handleEditIngredient = (ingredient: any) => {
        setSelectedIngredient(ingredient);
        setEditModalVisible(true);
    };

    const handleSaveIngredient = (updatedIngredient: any) => {
        updateIngredient(updatedIngredient);
        setEditModalVisible(false);
    };

    const handleDeleteIngredient = (ingredient: any) => {
        deleteIngredient(ingredient.id);
        setEditModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.title}>Inventario</Text>
                    <Text style={styles.subtitle}>Revisa y edita tu inventario de ingredientes</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Ingredientes</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setAddModalVisible(true)}
                        >
                            <Text style={styles.addButtonText}>Agregar</Text>
                        </TouchableOpacity>
                    </View>

                    {ingredients.map((ingredient: any) => (
                        <IngredientCard
                            key={ingredient.id}
                            name={ingredient.name}
                            quantity={`${ingredient.quantity} disponible${ingredient.quantity !== 1 ? 's' : ''}`}
                            icon={ingredient.icon}
                            onEdit={() => handleEditIngredient(ingredient)}
                        />
                    ))}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <BottomNavigation items={navigationItems} onScannerPress={handleScannerPress} />

            <AddIngredientModal
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAdd={handleAddIngredients}
            />

            <EditIngredientModal
                visible={editModalVisible}
                ingredient={selectedIngredient}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSaveIngredient}
                onDelete={handleDeleteIngredient}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    container: { flex: 1, backgroundColor: '#FFF' },
    scroll: { flex: 1 },
    section: { paddingHorizontal: 10, marginTop: 14 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    addButton: {
        backgroundColor: '#C17A3A',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default Inventory;