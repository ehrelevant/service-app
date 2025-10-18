import { Button, Input } from '@repo/components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { authClient } from '../auth-client';
import { AuthStackParamList } from '../navigation/AuthStack';
import { useAuth } from '../context/AuthContext';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function SignUpScreen() {
  const navigation = useNavigation<SignUpNavProp>();
  const { login } = useAuth();

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
        async onSuccess(ctx) {
          console.log('Success!');
          console.log(ctx);
          await login();
        },
        async onError(ctx) {
          console.log('Error!');
          console.log(ctx.error);
        },
      },
    );
  };

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
