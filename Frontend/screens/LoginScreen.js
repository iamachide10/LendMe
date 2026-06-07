import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="light-content" />

        {/* Logo */}
        <View style={styles.logoRing}>
          <Text style={styles.logoLetter}>A</Text>
        </View>

        {/* Heading */}
        <Text style={styles.headline}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue to{' '}
          <Text style={styles.subtitleAccent}>Achides Hub</Text>
        </Text>

        {/* Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#4b5563"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              placeholder="••••••••"
              placeholderTextColor="#4b5563"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Sign In</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <TouchableOpacity
          style={styles.switchWrap}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.switchText}>
            Don't have an account?{' '}
            <Text style={styles.switchLink}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#12121b' },
  container: {
    flexGrow: 1,
    backgroundColor: '#12121b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logoRing: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoLetter: { fontSize: 28, fontWeight: '800', color: '#fff' },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  subtitleAccent: { color: '#a5b4fc' },
  form: { width: '100%', marginBottom: 8 },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputFlex: { flex: 1, marginBottom: 0 },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  eyeText: { fontSize: 16 },
  forgotWrap: { alignItems: 'flex-end', marginTop: -8, marginBottom: 24 },
  forgotText: { fontSize: 13, color: '#6366f1' },
  btnPrimary: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { color: '#4b5563', fontSize: 13, marginHorizontal: 12 },
  btnSecondary: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: { color: '#9ca3af', fontSize: 15 },
  switchWrap: { marginTop: 28 },
  switchText: { color: '#6b7280', fontSize: 14 },
  switchLink: { color: '#6366f1', fontWeight: '600' },
});
