import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AddIngredientModal from '../../components/inventory/AddIngredientModal';
import EditIngredientModal from '../../components/inventory/EditIngredientModal';
import IngredientCard from '../../components/inventory/IngredientCard';
import { useInventory } from '../../hooks/useInventory';

const Inventory = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const { refresh } = useLocalSearchParams();

  const {
    ingredients,
    isLoading,
    error,
    refreshInventory,
    addIngredients,
    updateIngredient,
    deleteIngredient
  } = useInventory();

  useEffect(() => {
    if (refresh === 'true') {
      refreshInventory();
    }
  }, [refresh]);

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

  const handleRefresh = () => {
    refreshInventory();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#C17A3A" />
        <Text style={styles.loadingText}>Cargando inventario...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Inventario</Text>
          <Text style={styles.subtitle}>Revisa y edita tu inventario de ingredientes</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Ingredientes ({ingredients.length})
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {ingredients.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No hay ingredientes en tu inventario
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Usa el scanner para agregar ingredientes automáticamente
              </Text>
            </View>
          ) : (
            ingredients.map((ingredient: any) => (
              <IngredientCard
                key={ingredient.id}
                name={ingredient.name}
                quantity={`${ingredient.quantity} disponible${ingredient.quantity !== 1 ? 's' : ''}`}
                icon={ingredient.icon}
                onEdit={() => handleEditIngredient(ingredient)}
              />
            ))
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#C17A3A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Inventory;
