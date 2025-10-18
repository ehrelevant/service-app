import { ActivityIndicator } from 'react-native';
import { Button, Input } from '@repo/components';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { authClient } from '../auth-client';
import { AuthStackParamList } from '../navigation/AuthStack';

type SignInNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function SignInScreen() {
  const navigation = useNavigation<SignInNavProp>();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        async onRequest(ctx) {
          console.log('Requesting...');
          console.log(ctx);

          setIsLoading(true);
        },
        async onSuccess(ctx) {
          console.log('Success!');
          console.log(ctx);

          setIsLoading(false);
        },
        async onError(ctx) {
          console.log('Error!');
          console.log(ctx.error);

          setIsLoading(false);
        },
      },
    );
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
        <Button title="Sign In" onPress={handleSignIn} />

        <Pressable onPress={() => navigation.replace('SignUp')}>
          <Text>
            Don&apos;t have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign Up</Text>
          </Text>
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
