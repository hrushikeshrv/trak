import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TrackerList from "./trackerList";
import NewTracker from "./newTracker";
import TrackerDetail from "./trackerDetail";

const Stack = createNativeStackNavigator();

export default function NewTrackerNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='ListTrackers' component={TrackerList} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='DetailTracker' component={TrackerDetail} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='NewTracker' component={NewTracker} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    )
}