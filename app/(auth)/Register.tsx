import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { login, registrarUsuario } from '../../services/api/authService';

interface FormErrors {
  fullName?: string;
  email?: string;
  country?: string;
  password?: string;
  terms?: string;
}

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong' } => {
    const minLength = password.length >= 8;

    return {
      isValid: minLength,
      strength: minLength ? 'strong' : 'weak'
    };
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!termsAccepted) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registrationData = {
        email,
        nombre: fullName,
        pais: country,
        password,
      };

      await registrarUsuario(registrationData);
      await login({
        email,
        password,
      });

      router.push('/onboarding');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Hubo un problema al crear tu cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (!password) return Colors.light.border;
    const { strength } = validatePassword(password);
    switch (strength) {
      case 'weak': return Colors.light.error;
      case 'medium': return '#F59E0B';
      case 'strong': return Colors.light.success;
      default: return Colors.light.border;
    }
  };

  const getPasswordStrengthText = () => {
    if (!password) return '';
    const { strength } = validatePassword(password);
    switch (strength) {
      case 'weak': return 'Débil';
      case 'medium': return 'Media';
      case 'strong': return 'Fuerte';
      default: return '';
    }
  };

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

        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Únete a LazyFood y empieza a cocinar</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nombre completo"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              selectionColor={Colors.light.primary}
            />
          </View>
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              selectionColor={Colors.light.primary}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="País"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              selectionColor={Colors.light.primary}
            />
          </View>
          {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              selectionColor={Colors.light.primary}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {password && (
            <View style={styles.passwordStrength}>
              <View style={[styles.strengthBar, { backgroundColor: getPasswordStrengthColor() }]} />
              <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                {getPasswordStrengthText()}
              </Text>
            </View>
          )}
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTermsAccepted(!termsAccepted)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxBox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxText}>Acepto los </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.linkText}>términos y condiciones</Text>
                </TouchableOpacity>
                <Text style={styles.checkboxText}> y la </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.linkText}>política de privacidad</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
          {errors.terms && <Text style={styles.checkboxErrorText}>{errors.terms}</Text>}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <Text style={styles.primaryButtonText}>Creando cuenta...</Text>
            ) : (
              <Text style={styles.primaryButtonText}>Crear cuenta</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Inicia sesión</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
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
  inputContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeButton: {
    padding: 4,
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  strengthBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  checkboxContainer: {
    marginBottom: 24,
    marginTop: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  checkboxTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkboxText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    color: Colors.light.primary,
    textDecorationLine: 'underline',
    fontSize: 14,
    lineHeight: 20,
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
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6B7280',
    marginBottom: 6,
  },
  footerLink: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  checkboxErrorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: -16,
    marginBottom: 8,
    marginLeft: 4,
  },
});
