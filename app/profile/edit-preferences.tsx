import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/theme';
import { setPreferences } from '../../services/storage/preferences';

const diets = ['Omnívora', 'Vegetariana', 'Vegana', 'Pescetariana'];
const allergies = ['Sin alergias', 'Gluten', 'Lácteos', 'Frutos secos'];
const likes = ['Picante', 'Dulce', 'Salado', 'Ácido'];

export default function EditPreferences() {
  const router = useRouter();

  const [selectedDiet, setSelectedDiet] = React.useState<string>('Omnívora');
  const [selectedAllergies, setSelectedAllergies] = React.useState<string[]>(['Sin alergias']);
  const [selectedLikes, setSelectedLikes] = React.useState<string[]>([]);

  const toggleMulti = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    if (arr.includes(val)) {
      setArr(arr.filter(a => a !== val));
    }
    else {
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

  const handleSave = () => {
    console.log('Preferencias guardadas:', {
      diet: selectedDiet,
      allergies: selectedAllergies,
      likes: selectedLikes,
    });
        setPreferences({ diet: selectedDiet, allergies: selectedAllergies, likes: selectedLikes });
    router.back();
  };

  const renderChips = (
    data: string[], 
    selectedItems: string | string[], 
    onPress: (item: string) => void
  ) => (
    <View style={styles.chipsRow}>
      {data.map(item => {
        const isActive = Array.isArray(selectedItems) 
          ? selectedItems.includes(item) 
          : selectedItems === item;

        return (
          <TouchableOpacity 
            key={item} 
            style={[styles.chip, isActive && styles.chipActive]} 
            onPress={() => onPress(item)}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

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

        <View style={styles.actionsRow}>
          <Button 
            variant="outline" 
            onPress={() => router.back()} 
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
          <Button 
            onPress={handleSave} 
            style={styles.saveButton}
          >
            Guardar
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