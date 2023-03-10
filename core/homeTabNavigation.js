import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons';

import Dashboard from "./dashboard";
import Settings from "./settings/settings";
import HomeStackNavigation from "./homeStackNavigation";
import SettingsStackNavigation from "./settingsStackNavigation";

const Tab = createBottomTabNavigator();

export default function HomeTabNavigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
                        else if (route.name === 'TrackerList') iconName = focused ? 'list-sharp' : 'list-outline';
                        else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
                        return <Ionicons name={iconName} size={size} color={color}></Ionicons>
                    },
                    tabBarActiveTintColor: 'black'
                })}
            >
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                ></Tab.Screen>
                <Tab.Screen
                    name="TrackerList"
                    component={HomeStackNavigation}
                    options={{ title: 'My Trackers' }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Settings"
                    component={SettingsStackNavigation}
                ></Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}