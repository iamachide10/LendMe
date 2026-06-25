import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { registerUser } from '../../api/authApi';
import { saveTokens } from '../../utils/tokenStorage';
import { useAuthStore } from '../../store/authStore';
import { getEmailError, getPasswordError, getNameError } from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const setAuth = useAuthStore(state => state.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const validate = (): boolean => {
    const nErr = getNameError(name);
    const eErr = getEmailError(email);
    const pErr = getPasswordError(password);
    const cErr = password !== confirmPassword ? 'Passwords do not match' : null;

    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmError(cErr);

    return !nErr && !eErr && !pErr && !cErr;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      await saveTokens(res.accessToken, res.refreshToken);
      setAuth(res.user, res.accessToken, res.refreshToken);
    } catch (err: any) {
      console.log(err)
      Alert.alert(
        'Registration Failed',
        err?.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>UniSwap</Text>
        <Text style={styles.subtitle}>Create your KNUST account</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            placeholder="Your full name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={text => {
              setName(text);
              setNameError(null);
            }}
          />
          {nameError && <Text style={styles.errorText}>{nameError}</Text>}

          <Text style={styles.label}>KNUST Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="you@knust.edu.gh"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailError(null);
            }}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Minimum 8 characters"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={text => {
              setPassword(text);
              setPasswordError(null);
            }}
          />
          {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, confirmError ? styles.inputError : null]}
            placeholder="Repeat your password"
            placeholderTextColor="#666"
            secureTextEntry
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              setConfirmError(null);
            }}
          />
          {confirmError && <Text style={styles.errorText}>{confirmError}</Text>}

          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : null]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0b0',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
  },
  label: {
    fontSize: 13,
    color: '#a0a0b0',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  inputError: {
    borderColor: '#e94560',
  },
  errorText: {
    color: '#e94560',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    color: '#a0a0b0',
    fontSize: 13,
  },
  loginTextBold: {
    color: '#e94560',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;