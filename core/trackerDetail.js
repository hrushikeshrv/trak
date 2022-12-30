import React from 'react';
import {Text, View, ScrollView, Pressable, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import { formatDate, transformData } from "./utils";

import styles from './styles'

function deleteTracker(id, navigation) {
    Alert.alert(
        "Are you sure?",
        "Are you sure you want to delete this tracker?",
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

function renderRecordRow(record) {
    const x = new Date(record[0]);
    const y = record[1];
    return (
        <View style={[styles.row, styles.jcsb, styles.recordRow]} key={record[2]}>
            <Text>{formatDate(x)}</Text>
            <Text style={{fontFamily: 'monospace', fontSize: 18}}>{y}</Text>
        </View>
    )
}

function renderRecords(records) {
    const data = [];
    for (let i = 0; i < records.x.length; i++) {
        data.push([records.x[i], records.y[i], i]);
    }
    return (
        <View style={[styles.marginTop, styles.marginBottom]}>
            {data.map(renderRecordRow)}
        </View>
    )
}

function TrackerDetail({ route, navigation }) {
    const { tracker } = route.params;
    console.log(tracker);
    return (
        <ScrollView style={styles.screenContainer}>
            <View style={{alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.heading}>{tracker.name}</Text>
            </View>

            <VictoryChart
                theme={VictoryTheme.material}
            >
                <VictoryLine
                    style={{
                        data: { stroke: "tomato" },
                        parent: {border: "1px solid #ccc"}
                    }}
                    data={transformData(tracker.records)}
                    interpolation='monotoneX'
                >
                </VictoryLine>
            </VictoryChart>

            {renderRecords(tracker.records)}

            <View style={{alignItems: 'center'}}>
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

export default TrackerDetail;