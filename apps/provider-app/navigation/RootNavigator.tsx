import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';

import { AuthStack } from './AuthStack';
import { MainStack } from './HomeStack';

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return <NavigationContainer>{isAuthenticated ? <MainStack /> : <AuthStack />}</NavigationContainer>;
};
