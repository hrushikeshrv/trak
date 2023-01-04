import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TrackerList from "./trackerList";
import NewTracker from "./newTracker";
import TrackerDetail from "./trackerDetail";
import AddRecord from './addRecord';
import TrackerRecordList from "./trackerRecordList";

const Stack = createNativeStackNavigator();

export default function HomeStackNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='ListTrackers' component={TrackerList} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='ListTrackerRecords' component={TrackerRecordList} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='DetailTracker' component={TrackerDetail} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='AddRecord' component={AddRecord} options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen name='NewTracker' component={NewTracker} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    )
}