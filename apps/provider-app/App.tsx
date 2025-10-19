import { KeyboardProvider } from 'react-native-keyboard-controller';
import { RootNavigator } from '@navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <RootNavigator />
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
