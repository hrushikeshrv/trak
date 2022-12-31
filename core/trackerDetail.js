import React from 'react';
import { Text, View, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackerChart from "./trackerChart";
import { formatDate } from "./utils";

import styles from './styles'
import Ionicons from "@expo/vector-icons/Ionicons";

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
                                    navigation.goBack();
                                })
                        })
                }
            }
        ]
    )
}

function TrackerDetail({ route, navigation }) {
    const { tracker } = route.params;
    return (
        <ScrollView style={styles.screenContainer}>
            <View style={{alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.heading}>{tracker.name}</Text>
            </View>
            <TrackerChart tracker={tracker}></TrackerChart>
            <View style={styles.centeredRow}>
                <TextInput
                    placeholder="Add Record"
                    style={styles.textInput}
                ></TextInput>
                <Pressable
                    style={styles.simpleButton}
                >
                    <Ionicons name='add-outline' size={20} color='black'></Ionicons>
                </Pressable>
            </View>

            <Text style={[styles.heading2, styles.marginTopDouble]}>Records</Text>
            <Records records={tracker.records}></Records>
            <View style={{alignItems: 'center', paddingBottom: 90}}>
                <Pressable
                    style={styles.deleteButton}
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


function renderRecordRow(record) {
    const x = new Date(record[0]);
    const y = record[1];
    return (
        <View style={[styles.row, styles.jcsb, styles.recordRow]} key={record[2]}>
            <Text style={{fontFamily: 'monospace'}}>{formatDate(x)}</Text>
            <Text style={{fontFamily: 'monospace', fontSize: 18}}>{y}</Text>
        </View>
    )
}

function Records(props) {
    const data = [];
    for (let i = 0; i < props.records.x.length; i++) {
        data.push([props.records.x[i], props.records.y[i], i]);
    }
    data.sort((a, b) => {
        const d1 = new Date(a[0]);
        const d2 = new Date(b[0]);
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return 0;
    })
    return (
        <View style={[styles.marginTop, styles.marginBottom]}>
            {data.map(renderRecordRow)}
        </View>
    )
}

export default TrackerDetail;