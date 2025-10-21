import { Button } from '@repo/components';
import { colors } from '@repo/theme';
import { StyleSheet, View } from 'react-native';
import { UserPen } from 'lucide-react-native';

export function OptionsScreen() {
  return (
    <View style={styles.container}>
      <Button title="Manage Profile" variant="text" leftIcon={
        <UserPen size={24} color={colors.black} />
      }/>
      <Button title="View Transaction History" variant="text" leftIcon={
        <UserPen size={24} color={colors.black} />
      }/>
      <Button title="Sign Out" variant="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
