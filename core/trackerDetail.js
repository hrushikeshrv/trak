import React from 'react';
import {Text, View, ScrollView, Pressable, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

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

function TrackerDetail({ route, navigation }) {
    const { tracker } = route.params;
    return (
        <ScrollView style={styles.screenContainer}>
            <View style={{alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.heading}>{tracker.name}</Text>
                <Pressable
                    style={styles.deleteButton}
                    onPress={() => {
                        deleteTracker(tracker.id, navigation);
                    }}
                >
                    <Text>DELETE</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default TrackerDetail;