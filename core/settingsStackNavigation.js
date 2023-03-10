import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ImportData from "./settings/importData";
import Notifications from './settings/notifications';
import Settings from './settings/settings';

const Stack = createNativeStackNavigator();

export default function SettingsStackNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='SettingsList' component={Settings} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='Notifications' component={Notifications} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='ImportData' component={ImportData} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    )
}