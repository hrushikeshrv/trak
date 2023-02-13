import React from 'react';
import { Text, View, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackerChart from "./trackerChart";
import { formatDate } from "./utils";

import styles from './styles'
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "react-native-modal-datetime-picker";

function deleteTracker(id, navigation) {
    Alert.alert(
        "Are you sure?",
        "Are you sure you want to delete this tracker? This cannot be undone.",
        [
            {
                text: "Cancel",
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: "Delete",
                onPress: () => {
                    AsyncStorage.getItem('Trackers')
                        .then(trackers => {
                            trackers = JSON.parse(trackers).filter(tracker => (tracker.id !== id));
                            AsyncStorage.setItem('Trackers', JSON.stringify(trackers))
                                .then(() => {
                                    AsyncStorage.getItem('Notifications')
                                        .then(notifications => {
                                            notifications = JSON.parse(notifications);
                                            if (!notifications) return;
                                            const scheduledNotificationId = notifications[id];
                                            delete notifications[id];
                                            if (!scheduledNotificationId) return;
                                            Notifications.cancelScheduledNotificationAsync(scheduledNotificationId)
                                                .then(() => {
                                                    AsyncStorage.setItem('Notifications', JSON.stringify(notifications))
                                                        .then(() => {navigation.navigate('TrackerList');})
                                                }) // classic callback hell
                                        })
                                })
                        })
                }
            }
        ]
    )
}

class TrackerDetail extends React.Component{
    state = {
        newReading: '',
        datePickerVisible: false,
        newDate: new Date(),
    }

    saveRecord = () => {
        const { tracker } = this.props.route.params;
        const date = this.state.newDate;
        const id = tracker.id;

        AsyncStorage.getItem('Trackers')
            .then(trackers => {
                trackers = JSON.parse(trackers);
                for (let i = 0; i < trackers.length; i++) {
                    if (trackers[i].id === id) {
                        trackers[i].records.x.push(date);
                        trackers[i].records.y.push(parseFloat(this.state.newReading));
                        break;
                    }
                }
                AsyncStorage.setItem('Trackers', JSON.stringify(trackers))
                    .then(() => {
                        let idx = 0;
                        for (let i = 0; i < tracker.records.x.length; i++) {
                            if (tracker.records.x[i].toString() > date.toString()) {
                                idx = i-1;
                                break;
                            }
                        }
                        tracker.records.x.splice(idx, 0, date.toString());
                        tracker.records.y.splice(idx, 0, parseFloat(this.state.newReading));
                        this.setState({ newReading: '', newDate: new Date() })
                    })
            })
    }

    toggleDatePicker = () => {
        this.setState(prevState => ({datePickerVisible: !prevState.datePickerVisible}))
    }

    render() {
        const { tracker } = this.props.route.params;
        const navigation = this.props.navigation;
        return (
            <ScrollView style={styles.screenContainer}>
                <DateTimePicker
                    isVisible={this.state.datePickerVisible}
                    mode="datetime"
                    onConfirm={date => {
                        this.setState({ newDate: date });
                        this.toggleDatePicker();
                    }}
                    onCancel={this.toggleDatePicker}
                ></DateTimePicker>
                <View style={{alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap'}}>
                    <Text style={styles.heading}>{tracker.name}</Text>
                </View>
                <TrackerChart tracker={tracker}></TrackerChart>
                <View style={[styles.marginTop, styles.newRecordFieldset]}>
                    <TextInput
                        placeholder="Add Record"
                        style={styles.textInput}
                        keyboardType='numeric'
                        onChangeText={text => {
                            if (isNaN(text) || isNaN(parseFloat(text))) return;
                            this.setState({ newReading: text })
                        }}
                        value={this.state.newReading}
                    ></TextInput>
                    <Pressable
                        onPress={this.toggleDatePicker}
                        style={[styles.textInput, {paddingTop: 12, paddingBottom: 10}]}
                    >
                        <Text style={{fontWeight: 'bold'}}>{formatDate(this.state.newDate)}</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.simpleButton, styles.marginTop, {width: '80%', alignSelf: 'center'}]}
                        onPress={() => {
                            if (this.state.newReading && this.state.newDate) this.saveRecord();
                        }}
                    >
                        <View style={styles.centeredRow}>
                            <Ionicons name='add-outline' size={20} color='white'></Ionicons>
                            <Text style={{ color: 'white' }}>Save</Text>
                        </View>
                    </Pressable>
                </View>

                <View style={[styles.centeredRow, styles.marginBottomDouble, styles.marginTopDouble]}>
                    <Pressable
                        style={[styles.simpleButton, styles.spacelr]}
                        onPress={() => {
                            const { navigation } = this.props;
                            navigation.navigate('ListTrackerRecords', {tracker: this.props.route.params.tracker});
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>Records</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.deleteButton, styles.spacelr]}
                        onPress={() => {
                            deleteTracker(tracker.id, navigation);
                        }}
                    >
                        <Text style={{color: 'white'}}>DELETE</Text>
                    </Pressable>
                </View>
            </ScrollView>
        )
    }
}

// export default TrackerDetail;
export default function({ route, navigation }) {
    return <TrackerDetail route={route} navigation={navigation}></TrackerDetail>
}