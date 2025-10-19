import { authClient } from '@lib/authClient';
import { NavigationContainer } from '@react-navigation/native';

import { AuthStack } from './AuthStack';
import { DashboardTabs } from './DashboardTabs';

export function RootNavigator() {
  const { data: session } = authClient.useSession();

  return <NavigationContainer>{session === null ? <AuthStack /> : <DashboardTabs />}</NavigationContainer>;
}
