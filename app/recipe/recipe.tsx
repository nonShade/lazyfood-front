import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RecipeDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#374151" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.text}>Detalle de receta ID: {params.id}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  back: { padding: 12, marginTop: 20, marginLeft: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#111827' },
});

export default RecipeDetail;
