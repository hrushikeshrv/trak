import React from 'react';
import {View, Text, Platform} from 'react-native';
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
        notification: null
    }

    componentDidMount() {
        this.getPermissionAsync();
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

    render() {
        return (
            <View style={styles.screenContainer}>
                <Text style={styles.heading}>Notifications</Text>
            </View>
        )
    }
}

export default function () {
    const navigation = useNavigation();
    return <NotificationsScreen navigation={navigation}></NotificationsScreen>;
}