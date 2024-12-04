import React, { useEffect, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, Platform, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBarButton from './TabBarButton';

export function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // Safe area
  const [dimensions, setDimensions] = useState({ width: 100, height: 20 });
  const windowWidth = Dimensions.get('window').width;
  const buttonWidth = dimensions.width / state.routes.length || windowWidth / state.routes.length;
  const tabBarPositionX = useSharedValue(0);

  useEffect(() => {
    tabBarPositionX.value = withSpring(buttonWidth * state.index, { duration: 500 });
  }, [state.index, buttonWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabBarPositionX.value }],
    height: buttonWidth - 75,
    width: buttonWidth - 25,
  }));

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  return (
    <SafeAreaView>
      <View onLayout={onTabBarLayout} style={[styles.tabBar, { bottom: Platform.OS === 'ios' ? 0 : insets.bottom }]}>
        <Animated.View style={[styles.icon, animatedStyle]} />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

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
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItems}
              isFocused={isFocused}
              routeName={route.name}
              color={isFocused ? colors.primary : colors.text}
              label={label}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'pink',
    marginHorizontal: 0,
    paddingVertical: Platform.OS === 'ios' ? 38.5 : 30, // Adjust dynamically
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: 'black',
    opacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
  },
  tabItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  icon: {
    position: 'absolute',
    backgroundColor: '#E2DFD2',
    opacity: 0.4,
    borderRadius: 30,
    marginHorizontal: 17,
  },
});
