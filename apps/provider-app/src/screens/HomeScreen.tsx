import { authClient } from '@lib/authClient';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Button } from '@repo/components';
import type { DashboardTabsParamList } from '@navigation/DashboardTabs';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type HomeNavProp = BottomTabNavigationProp<DashboardTabsParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
      <Text style={styles.subtitle}>Subtitle</Text>
      <Button
        title="Profile"
        onPress={() => {
          navigation.navigate('Profile');
        }}
      />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
