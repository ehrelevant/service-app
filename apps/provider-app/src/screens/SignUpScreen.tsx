import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import { Button, Input, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';


type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function SignUpScreen() {
  const navigation = useNavigation<SignUpNavProp>();

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = async () => {
    setIsLoading(true);
    setErrorMessage('')

    console.log('Requesting...');
    const { data, error } = await authClient.signUp.email(
      {
        name: firstName,
        middleName,
        lastName,
        email,
        password,
        phoneNumber,
      },
    );

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
        <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} />
        <Input placeholder="Middle Name" value={middleName} onChangeText={setMiddleName} />
        <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Input placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />

        {errorMessage !== '' &&
          <Typography variant='body1' color={colors.error}>
            {errorMessage}
          </Typography>
        }

        <Button title="Sign Up" onPress={handleSignUp} />

        <Pressable onPress={() => navigation.replace('SignIn')}>
          <Typography variant='subtitle1'>
            Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign In</Text>
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
