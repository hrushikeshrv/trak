import React, { createRef } from 'react';
import {View, Text, Platform, Pressable, ScrollView, Modal} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import styles from '../styles';

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
        activeTracker: null,
        notificationModalVisible: false,
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
            <Pressable
                style={[styles.centeredRow, styles.trackerNotificationRow]}
                key={tracker.id}
                onPress={() => {
                    this.setState({activeTracker: tracker, notificationModalVisible: true})
                }}
            >
                <Text style={{ color: 'white', marginRight: 10, fontWeight: 'bold' }}>{tracker.name} -</Text>
                <Text style={{ color: 'white' }}>
                    {
                        tracker.id in this.state.scheduledNotifications
                            ? ''
                            : 'No notification scheduled'
                    }
                </Text>
            </Pressable>
        )
    }

    scheduleNotification = async (trackerId, trackerName, hour, minute, day) => {
        if (trackerId in this.state.scheduledNotifications)
            this.cancelScheduledNotification(trackerId)
                .then(() => this.scheduleNotification(trackerId, trackerName, hour, minute, day));
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: trackerName,
                body: 'Enter a record for this tracker'
            },
            trigger: {
                hour: hour,
                minute: minute,
                day: day,
                repeats: true
            }
        })
        // Update this.state.scheduledNotifications
    }

    cancelScheduledNotification = async (id) => {

    }

    toggleNotificationModal = () => {
        this.setState(prevState => ({notificationModalVisible: !prevState.notificationModalVisible}))
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.notificationModalVisible}
                    onRequestClose={() => {
                        this.toggleNotificationModal();
                    }}
                >
                    <View style={styles.screenContainer}>
                        <Text style={styles.heading}>{this.state.activeTracker?.name}</Text>
                        <Text style={styles.marginTop}>Remind me to record my {this.state.activeTracker?.name.toLowerCase()}</Text>
                        <View style={[styles.centeredRow, styles.marginTopDouble, styles.ajc]}>
                            <Text style={{ marginRight: 10 }}>Every</Text>
                            <Pressable style={[styles.button, {marginRight: 10}]}>
                                <Text>7</Text>
                            </Pressable>
                            <Text>days</Text>
                        </View>
                        <Pressable
                            style={[styles.simpleButton, styles.marginTop]}
                            onPress={() => {
                                this.setState({ activeTracker: null });
                                this.toggleNotificationModal();
                            }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center' }}>Done</Text>
                        </Pressable>
                    </View>
                </Modal>
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