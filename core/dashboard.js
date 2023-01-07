import React from 'react';
import { Text, ScrollView, Pressable, View } from 'react-native';
import styles from './styles'
import TrackerChart from "./trackerChart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";

function UpdateTrackers({ onUpdate }) {
    useFocusEffect(React.useCallback(() => {
        onUpdate();
    }, []));
    return null;
}

export default class Dashboard extends React.Component {
    state = {
        tracker1: null,
        tracker2: null,
        isReady: false,
    }

    componentDidMount() {
        this.updateTrackersAsync()
            .then(() => {
                this.setState({ isReady: true })
            })
    }

    updateTrackersAsync = async () => {
        let tracker1Id = null;
        let tracker2Id = null;
        AsyncStorage.getItem('Settings')
            .then(settings => {
                settings = JSON.parse(settings);
                tracker1Id = settings.defaultTracker1;
                tracker2Id = settings.defaultTracker2;
            })
        AsyncStorage.getItem('Trackers')
            .then(trackers => {
                trackers = JSON.parse(trackers);
                for (let i = 0; i < trackers.length; i++) {
                    if (trackers[i].id === tracker1Id) this.setState({ tracker1: trackers[i] });
                    if (trackers[i].id === tracker2Id) this.setState({ tracker2: trackers[i] });
                }
            })
    }

    render() {
        if (!this.state.isReady)
            return (
                <View style={styles.screenContainer}>
                    <UpdateTrackers onUpdate={this.updateTrackersAsync}></UpdateTrackers>
                    <Text>Loading...</Text>
                </View>
            )
        else if (!this.state.tracker1 && !this.state.tracker2)
            return (
                <ScrollView
                    style={styles.screenContainer}
                    contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
                >
                    <UpdateTrackers onUpdate={this.updateTrackersAsync}></UpdateTrackers>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Configure your default trackers in settings</Text>
                    <Text style={{ marginTop: 20, textAlign: 'center' }}>Default trackers will be shown on the dashboard</Text>
                </ScrollView>
            )
        return (
            <ScrollView style={styles.screenContainer}>
                <UpdateTrackers onUpdate={this.updateTrackersAsync}></UpdateTrackers>
                <DashboardChart tracker={this.state.tracker1}></DashboardChart>
                <DashboardChart tracker={this.state.tracker2}></DashboardChart>
                <View style={styles.paddingBottomDouble}></View>
            </ScrollView>
        )
    }
}

function DashboardChart({ tracker }) {
    if (!tracker) return null;
    return (
        <View style={{ flex: 1 }}>
            <Pressable>
                <Text style={styles.heading}>{tracker.name}</Text>
            </Pressable>
            <TrackerChart tracker={tracker}></TrackerChart>
        </View>
    )
}