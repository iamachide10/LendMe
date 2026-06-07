import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';



export default function WelcomeScreen({ navigation }) {  // ✅ ADD { navigation } HERE
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.logoRing}>
        <Text style={styles.logoLetter}>A</Text>
      </View>

      <View style={styles.pill}>
        <Text style={styles.pillText}>YOUR PERSONAL HUB</Text>
      </View>

      <Text style={styles.headline}>
        Welcome to {'\n'}
        <Text style={styles.headlineAccent}>Achides Hub</Text>
      </Text>

      <Text style={styles.subtitle}>
        Your command center for learning, building, and growing every single day.
      </Text>

      {/* ✅ Goes to Signup */}
      <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.btnPrimaryText}>Get Started</Text>
      </TouchableOpacity>

      {/* ✅ Goes to Login */}
      <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.btnSecondaryText}>I already have an account</Text>
      </TouchableOpacity>

      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoLetter: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  pill: {
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(56, 3, 3, 0.35)',
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  pillText: {
    fontSize: 11,
    color: '#a5b4fc',
    letterSpacing: 1.2,
    fontWeight: '500',
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  headlineAccent: {
    color: '#5f6cd8',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    fontWeight: '300',
  },
  btnPrimary: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  btnSecondary: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 28,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
  },
  dotActive: {
    width: 20,
    borderRadius: 3,
    backgroundColor: '#6366f1',
  },
});