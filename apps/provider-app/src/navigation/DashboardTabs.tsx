import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, palette } from '@repo/theme';
import { Home, Menu } from 'lucide-react-native';
import { HomeScreen } from '@screens/HomeScreen';
import { OptionsScreen } from '@screens/OptionsScreen';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '@repo/components';

export type DashboardTabsParamList = {
  Home: undefined;
  Options: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabsParamList>();

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }

        const renderIcon = () => {
          const iconProps = {
            size: 24,
            color: isFocused ? colors.actionPrimary : palette.gray500,
            strokeWidth: 2
          };

          if (route.name === 'Home') {
            return <Home {...iconProps} />;
          } else {
            return <Menu {...iconProps} />;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityLabel={`${label} tab`}
            accessibilityState={isFocused ? { selected: true } : {}}
            activeOpacity={0.7}
            onPress={onPress}
            style={styles.tabButton}
          >
            <View style={styles.tabContent}>
              {renderIcon()}
              <Typography
                variant="caption"
                color={isFocused ? colors.actionPrimary : palette.gray500}
                style={styles.label}
              >
                {label.toString()}
              </Typography>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function DashboardTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Options" component={OptionsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    paddingTop: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
  },
});