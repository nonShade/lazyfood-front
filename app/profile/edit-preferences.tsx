import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/theme';

export default function EditPreferences() {
  const router = useRouter();

  const handleSave = () => {
    console.log('Preferencias guardadas');
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Editar preferencias</Text>

        <View style={styles.actionsRow}>
          <Button
            variant="outline"
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
          <Button onPress={handleSave} style={styles.saveButton}>
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
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
});
