import { KeyboardProvider } from 'react-native-keyboard-controller';
import { queryClient } from '@lib/queryClient';
import { QueryClientProvider } from 'react-query';
import { RootNavigator } from '@navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <RootNavigator />
        </KeyboardProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
