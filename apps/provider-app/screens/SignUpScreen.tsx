import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from '@repo/components';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { authClient } from '../auth-client';
import { AuthStackParamList } from '../navigation/AuthStack';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function SignUpScreen() {
  const navigation = useNavigation<SignUpNavProp>();

  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = async () => {
    await authClient.signUp.email(
      {
        name: firstName,
        middleName,
        lastName,
        email,
        password,
        phoneNumber,
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
        <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} />
        <Input placeholder="Middle Name" value={middleName} onChangeText={setMiddleName} />
        <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Input placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />
        <Button title="Sign Up" onPress={handleSignUp} />

        <Pressable onPress={() => navigation.replace('SignIn')}>
          <Text>
            Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign In</Text>
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
