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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { loginUser } from '../../api/authApi';
import { saveTokens } from '../../utils/tokenStorage';
import { useAuthStore } from '../../store/authStore';
import { getEmailError, getPasswordError } from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const setAuth = useAuthStore(state => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validate = (): boolean => {
    const eErr = getEmailError(email);
    const pErr = getPasswordError(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    return !eErr && !pErr;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginUser({ email: email.trim(), password });
      await saveTokens(res.accessToken, res.refreshToken);
      setAuth(res.user, res.accessToken, res.refreshToken);
    } catch (err: any) {
      Alert.alert(
        'Login Failed',
        err?.response?.data?.message || 'Invalid email or password'
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
      <Text style={styles.logo}>UniSwap</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <View style={styles.form}>
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
          placeholder="Enter your password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={text => {
            setPassword(text);
            setPasswordError(null);
          }}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <TouchableOpacity
          style={[styles.button, loading ? styles.buttonDisabled : null]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerTextBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    color: '#a0a0b0',
    fontSize: 13,
  },
  registerTextBold: {
    color: '#e94560',
    fontWeight: 'bold',
  },
});

export default LoginScreen;