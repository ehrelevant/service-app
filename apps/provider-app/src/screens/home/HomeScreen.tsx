import { authClient } from '@lib/authClient';
import { Button, Typography } from '@repo/components';
import { StyleSheet, View } from 'react-native';

export function HomeScreen() {
  const { data: session } = authClient.useSession();

  if (session !== null) {
    const { user } = session;

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Typography variant='h3'>
            Hello, {user.name} {user.middleName && user.middleName[0] + '.'} {user.lastName}!
          </Typography>
          <Typography variant='subtitle1' align='center'>
            To get requests, please add an address and register your services.
          </Typography>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Add an Address" variant="outline" />
          <Button title="Register a Service" variant="primary" />
        </View>
      </View>
    )
  } else {
    return (
      <View style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 60,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%'
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
