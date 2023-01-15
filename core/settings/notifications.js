import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import styles from '../styles';


class NotificationsScreen extends React.Component {
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