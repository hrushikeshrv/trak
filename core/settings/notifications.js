import React, { createRef } from 'react';
import {View, Text, Platform, Pressable, ScrollView, Modal, TextInput, Alert} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "react-native-modal-datetime-picker";
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

        days: '7',
        time: null,
        timePickerVisible: false,
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
                console.log(this.state.scheduledNotifications);
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

    getNotificationTime = () => {
        const time = this.state.time;
        if (!time) return 'time';
        let hours = time.getHours();
        if (hours < 10) hours = '0' + hours;
        let minutes = time.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        return `${hours}:${minutes}`;
    }

    scheduleNotification = async (trackerId, trackerName, hour, minute) => {
        if (trackerId in this.state.scheduledNotifications)
            await this.cancelScheduledNotification(trackerId);
        const trigger = {
            hour: hour,
            minute: minute,
            repeats: true,
        }
        console.log(trigger);
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: trackerName,
                body: `Record your ${trackerName}`
            },
            trigger: trigger,
        })
        const notifs = this.state.scheduledNotifications;
        notifs[trackerId] = notificationId;
        this.setState({scheduledNotifications: notifs});
        await AsyncStorage.setItem('Notifications', JSON.stringify(notifs));
    }

    cancelScheduledNotification = async (id) => {
        return await Notifications.cancelScheduledNotificationAsync(id.toString());
    }

    toggleNotificationModal = () => {
        this.setState(prevState => ({notificationModalVisible: !prevState.notificationModalVisible}))
    }

    toggleTimePicker = () => {
        this.setState(prevState => ({timePickerVisible: !prevState.timePickerVisible}))
    }

    setTime = (time) => {
        this.setState({time})
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <DateTimePicker
                    isVisible={this.state.timePickerVisible}
                    mode='time'
                    onConfirm={this.setTime}
                    onCancel={this.toggleTimePicker}
                >
                </DateTimePicker>
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
                            <Text style={{ marginRight: 10, marginBottom: 15 }}>Every</Text>
                            <TextInput
                                style={[styles.button, {marginRight: 10, textAlign: 'center', fontSize: 18, fontFamily: 'monospace'}]}
                                value={this.state.days}
                                onChangeText={text => this.setState({days: text})}
                                keyboardType='numeric'
                            ></TextInput>
                            <Text style={{marginBottom: 15}}>days</Text>
                        </View>
                        <Pressable
                            style={[styles.centeredRow, styles.marginTop]}
                            onPress={this.toggleTimePicker}
                        >
                            <Text style={{ marginBottom: 15 }}>at </Text>
                            <Text style={[styles.button, {marginRight: 10, textAlign: 'center', fontSize: 18, fontFamily: 'monospace'}]}>{this.getNotificationTime()}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.simpleButton, styles.marginTop]}
                            onPress={() => {
                                this.setState({ activeTracker: null });
                                if (!this.state.time || !this.state.days) {
                                    this.toggleNotificationModal();
                                    return;
                                }
                                this.scheduleNotification(
                                    this.state.activeTracker.id,
                                    this.state.activeTracker.name,
                                    parseInt(this.state.time.getHours()),
                                    parseInt(this.state.time.getMinutes()),
                                    parseInt(this.state.days)
                                )
                                    .then(() => {
                                        this.toggleNotificationModal();
                                    })
                            }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center' }}>Done</Text>
                        </Pressable>
                    </View>
                </Modal>
                <Text style={styles.heading}>Notifications</Text>
                <ScrollView style={styles.screenContainer}>
                    {this.state.trackers.map(this.renderTrackerRow)}
                    <Text style={{padding: 20}}></Text>
                </ScrollView>
                <Pressable
                    style={[styles.simpleButton, styles.ajc, styles.centeredRow]}
                    onPress={() => {
                        Notifications.cancelAllScheduledNotificationsAsync()
                            .then(() => {
                                Alert.alert('All notifications stopped');
                                AsyncStorage.setItem('Notifications', '{}');
                                this.setState({scheduledNotifications: {}});
                            })
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop all notifications</Text>
                </Pressable>
            </View>
        )
    }
}

export default function () {
    const navigation = useNavigation();
    return <NotificationsScreen navigation={navigation}></NotificationsScreen>;
}