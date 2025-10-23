import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>LF</Text>
          </View>
        </View>

        <Text style={styles.title}>Lazy Food</Text>
        <Text style={styles.subtitle}>Tu cocina, más fácil que nunca</Text>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => router.push('../home')}>
            <Text style={styles.primaryButtonText}>Comenzar</Text>
          </TouchableOpacity>

          <View style={styles.linksRow}>
            <Text style={styles.smallText}>¿Olvidaste tu contraseña?</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Recuperala aquí</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.smallText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => router.push('Register' as any)}>
              <Text style={styles.linkText}>Registrate aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  logoWrap: {
    marginBottom: 18,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 12,
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 18,
  },
  form: {
    width: '100%',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  linksRow: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  registerRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  smallText: {
    color: '#374151',
    marginBottom: 6,
  },
  linkText: {
    color: Colors.light.primary,
    textDecorationLine: 'underline',
    marginTop: 0,
  },
});
