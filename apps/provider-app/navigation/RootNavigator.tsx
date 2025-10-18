import { NavigationContainer } from '@react-navigation/native';

import { authClient } from '../auth-client';

import { AuthStack } from './AuthStack';
import { MainStack } from './HomeStack';

export function RootNavigator() {
  const { data: session } = authClient.useSession();

  return <NavigationContainer>{session === null ? <AuthStack /> : <MainStack />}</NavigationContainer>;
};
