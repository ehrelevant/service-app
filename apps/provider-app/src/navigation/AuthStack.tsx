import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignInScreen } from '@screens/SignInScreen';
import { SignUpScreen } from '@screens/SignUpScreen';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn" screenOptions={{
      animationDuration: 400,
    }}>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{
        title: 'Sign In',
        animation: 'slide_from_left'
      }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{
        title: 'Sign Up',
        animation: 'slide_from_right'
      }} />
    </Stack.Navigator>
  );
};
