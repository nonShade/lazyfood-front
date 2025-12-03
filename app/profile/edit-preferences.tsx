import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/theme';
import { useProfile } from '../../hooks/useProfile';

const diets = ['Omnívora', 'Vegetariana', 'Vegana', 'Pescetariana'];
const allergies = ['Sin alergias', 'Gluten', 'Lácteos', 'Frutos secos', 'Mariscos', 'Huevo', 'Soja'];
const likes = ['Picante', 'Dulce', 'Salado', 'Ácido', 'Pasta', 'Frutas', 'Ensaladas'];
const cookingLevels = [
  { value: 1, label: 'Principiante' },
  { value: 2, label: 'Intermedio' },
  { value: 3, label: 'Avanzado' },
];
const nutritionalGoals = [
  'ninguna',
  'Mantener salud general',
  'Bajar de peso',
  'Aumentar masa muscular',
  'Mejorar energía',
  'Cocinar más en casa',
  'Ahorrar dinero',
];

export default function EditPreferences() {
  const router = useRouter();
  const { profile, isLoading, updatePreferences } = useProfile();

  const [selectedDiet, setSelectedDiet] = useState<string>('Omnívora');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['Sin alergias']);
  const [selectedLikes, setSelectedLikes] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('ninguna');
  const [saving, setSaving] = useState(false);

  const capitalize = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (profile) {
      const diet = profile.preferencias?.dieta ? capitalize(profile.preferencias.dieta) : 'Omnívora';
      setSelectedDiet(diet);

      if (profile.preferencias?.alergias && profile.preferencias.alergias.length > 0) {
        const loadedAllergies = profile.preferencias.alergias.map(a => capitalize(a));
        setSelectedAllergies(loadedAllergies);
      } else {
        setSelectedAllergies(['Sin alergias']);
      }

      if (profile.preferencias?.gustos && profile.preferencias.gustos.length > 0) {
        const loadedLikes = profile.preferencias.gustos.map(g => capitalize(g));
        setSelectedLikes(loadedLikes);
      } else {
        setSelectedLikes([]);
      }

      setSelectedLevel(profile.nivel_cocina || 1);

      const goal = profile.metas_nutricionales || 'ninguna';
      if (goal === 'ninguna') {
        setSelectedGoal('ninguna');
      } else {
        setSelectedGoal(capitalize(goal));
      }
    }
  }, [profile]);

  const toggleMulti = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    if (arr.includes(val)) {
      setArr(arr.filter(a => a !== val));
    } else {
      setArr([...arr, val]);
    }
  };

  const toggleAllergy = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    if (val === 'Sin alergias') {
      setArr(['Sin alergias']);
      return;
    }

    if (arr.includes(val)) {
      const next = arr.filter(a => a !== val);
      if (next.length === 0) setArr(['Sin alergias']);
      else setArr(next);
    } else {
      setArr([...arr.filter(a => a !== 'Sin alergias'), val]);
    }
  };

  const handleSave = async () => {
    if (!profile) {
      Alert.alert('Error', 'No se pudo cargar el perfil');
      return;
    }

    setSaving(true);
    try {
      const normalizedAllergies = selectedAllergies
        .filter(a => a !== 'Sin alergias')
        .map(a => a.toLowerCase());

      const normalizedLikes = selectedLikes.map(g => g.toLowerCase());

      await updatePreferences(profile.id, {
        dieta: selectedDiet.toLowerCase(),
        alergias: normalizedAllergies.length > 0 ? normalizedAllergies : [],
        gustos: normalizedLikes,
        nivel_cocina: selectedLevel,
        metas_nutricionales: selectedGoal,
      });

      Alert.alert('Éxito', 'Preferencias actualizadas correctamente');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar las preferencias');
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderChips = (
    data: string[] | { value: number; label: string }[],
    selectedItems: string | string[] | number,
    onPress: (item: any) => void
  ) => (
    <View style={styles.chipsRow}>
      {data.map(item => {
        const itemValue = typeof item === 'object' ? item.value : item;
        const itemLabel = typeof item === 'object' ? item.label : item;

        const isActive = Array.isArray(selectedItems)
          ? selectedItems.includes(itemValue as any)
          : selectedItems === itemValue;

        return (
          <TouchableOpacity
            key={String(itemValue)}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onPress(itemValue)}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{itemLabel}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (isLoading || !profile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Cargando preferencias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Editar preferencias</Text>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dieta</Text>
          {renderChips(diets, selectedDiet, setSelectedDiet)}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Alergias</Text>
          {renderChips(allergies, selectedAllergies, (item) =>
            toggleAllergy(selectedAllergies, setSelectedAllergies, item)
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Gustos</Text>
          {renderChips(likes, selectedLikes, (item) =>
            toggleMulti(selectedLikes, setSelectedLikes, item)
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nivel de cocina</Text>
          {renderChips(cookingLevels, selectedLevel, setSelectedLevel)}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Meta nutricional</Text>
          {renderChips(nutritionalGoals, selectedGoal, setSelectedGoal)}
        </View>

        <View style={styles.actionsRow}>
          <Button
            variant="outline"
            onPress={() => router.back()}
            style={styles.cancelButton}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onPress={handleSave}
            style={styles.saveButton}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 20
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },

  sectionContainer: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 10,
    marginBottom: 12,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  chipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },

  chipText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '500',
  },

  chipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },

  actionsRow: {
    flexDirection: 'row',
    marginTop: 30,
  },

  cancelButton: {
    flex: 1,
    marginRight: 10
  },

  saveButton: {
    flex: 1,
    marginLeft: 10
  },
});