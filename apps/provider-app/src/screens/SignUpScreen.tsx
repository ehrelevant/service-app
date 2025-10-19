import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import { Button, Input, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors.actionPrimary} />
      </SafeAreaView>
    )
  } else {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} bottomOffset={50}>
        <Input label="First Name*" placeholder="First Name" autoComplete="name-given" value={firstName} onChangeText={setFirstName} />
        <Input label="Middle Name" placeholder="Middle Name" autoComplete="name-middle" value={middleName} onChangeText={setMiddleName} />
        <Input label="Last Name*" placeholder="Last Name" autoComplete="name-family" value={lastName} onChangeText={setLastName} />
        <Input label="Email*" placeholder="Email" autoComplete="email" value={email} onChangeText={setEmail} />
        <Input label="Password*" placeholder="Password" autoComplete="new-password" value={password} onChangeText={setPassword} secureTextEntry />
        <Input label="Phone Number*" placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />

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
      </KeyboardAwareScrollView>
    );
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  }
});
