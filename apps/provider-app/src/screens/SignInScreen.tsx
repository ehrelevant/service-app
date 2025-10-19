import { ActivityIndicator } from 'react-native';
import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import { Button, Input, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type SignInNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function SignInScreen() {
  const navigation = useNavigation<SignInNavProp>();

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('')

    console.log('Requesting...');
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if(data !== null) {
      console.log(data);
    } else if (error !== null) {
      console.log(error);
      setErrorMessage(error.message ?? '');
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size='large' color={colors.actionPrimary} />
        </SafeAreaView>
      </SafeAreaProvider>
    )
  } else {
    return (
      <View style={styles.container}>
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        {errorMessage !== '' &&
          <Typography variant='body1' color={colors.error}>
            {errorMessage}
          </Typography>
        }

        <Button title="Sign In" onPress={handleSignIn} />

        <Pressable onPress={() => navigation.replace('SignUp')}>
          <Typography variant='subtitle1'>
            Don&apos;t have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign Up</Text>
          </Typography>
        </Pressable>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 10,
    padding: 10,
  },
});
