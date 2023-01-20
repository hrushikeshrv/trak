import React, { createRef } from 'react';
import {View, Text, Platform, Pressable, ScrollView} from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import styles from '../styles';
import {getPermissionsAsync} from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

class NotificationsScreen extends React.Component {
    state = {
        expoPushToken: '',
        notification: null,
        scheduledNotifications: {},
        trackers: [],
    }

    notificationListener = createRef();
    responseListener = createRef();

    componentDidMount() {
        this.getPermissionAsync();
        AsyncStorage.getItem('Notifications')
            .then(results => {
                results = JSON.parse(results);
                if (!results) results = {};
                this.setState({scheduledNotifications: results});
            })
        AsyncStorage.getItem('Trackers')
            .then(trackers => {
                this.setState({ trackers: JSON.parse(trackers) })
            })
        this.notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            this.setState({notification})
        })
        this.responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {})
    }

    getPermissionAsync = async () => {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Enable push notifications to use this feature');
            await AsyncStorage.setItem('NotificationsToken', '');
            return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await AsyncStorage.setItem('NotificationsToken', token);

        if (Platform.OS === 'Android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.DEFAULT,
            })
        }
    }

    renderTrackerRow = tracker => {
        return (
            <View style={[styles.centeredRow, styles.trackerNotificationRow]} key={tracker.id}>
                <Text style={{ color: 'white', marginRight: 10, fontWeight: 'bold' }}>{tracker.name} -</Text>
                <Text style={{ color: 'white' }}>
                    {
                        tracker.id in this.state.scheduledNotifications
                            ? ''
                            : 'No notification scheduled'
                    }
                </Text>
            </View>
        )
    }

    scheduleNotification = async (trackerId, trackerName, hour, minute) => {
        if (trackerId in this.state.scheduledNotifications)
            this.cancelScheduledNotification(trackerId)
                .then(() => this.scheduleNotification(trackerId, trackerName, hour, minute));
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: trackerName,
                body: 'Enter a record for this tracker'
            },
            trigger: {
                hour: hour,
                minute: minute,
                repeats: true
            }
        })
        // Update this.state.scheduledNotifications
    }

    cancelScheduledNotification = async (id) => {

    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <Text style={styles.heading}>Notifications</Text>
                <Pressable
                    onPress={async () => {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: "TRAK Notification",
                                body: "This is a notification",
                                data: { data: 'data' }
                            },
                            trigger: {
                                seconds: 1
                            }
                        })
                    }}
                >
                </Pressable>
                <ScrollView style={styles.screenContainer}>
                    {this.state.trackers.map(this.renderTrackerRow)}
                </ScrollView>
            </View>
        )
    }
}

export default function () {
    const navigation = useNavigation();
    return <NotificationsScreen navigation={navigation}></NotificationsScreen>;
}