import React from 'react';
import { Text, ScrollView, View, Pressable, Modal } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../styles'


export default class Settings extends React.Component {
    state = {
        isReady: false,
        defaultTracker1: null,
        defaultTracker2: null,
        trackers: null,
        trackerPickingModalVisible: false,
    }

    componentDidMount() {
        this.getCurrentSettingsAsync()
            .then(() => {this.setState({ isReady: true });});
    }

    getCurrentSettingsAsync = async () => {
        let settings = JSON.parse(await AsyncStorage.getItem('Settings'));
        if (Object.keys(settings).length === 0) {
            AsyncStorage.setItem('Settings', JSON.stringify({}))
                .then(() => {
                    settings = {}
                });
        }
        else {
            AsyncStorage.getItem('Trackers')
                .then(trackers => {
                    trackers = JSON.parse(trackers);
                    for (let i = 0; i < trackers.length; i++) {
                        if (trackers[i].id === settings.defaultTracker1)
                            this.setState({ defaultTracker1: trackers[i] });
                        if (trackers[i].id === settings.defaultTracker2)
                            this.setState({ defaultTracker2: trackers[i] });
                    }
                    this.setState({ trackers });
                })
        }
    }

    toggleTrackerPickingModal = () => {
        this.setState(prevState => ({ trackerPickingModalVisible: !prevState.trackerPickingModalVisible }))
    }

    DefaultTrackerRow = ({ tracker, id }) => {
        if (!tracker) return (
            <Pressable
                style={styles.settingsRow}
                onPress={this.toggleTrackerPickingModal}
            >
            <Text>Choose default tracker {id}</Text>
            </Pressable>
        )
        return (
            <Pressable
                style={styles.settingsRow}
                onPress={this.toggleTrackerPickingModal}
            >
            <Text style={{ fontWeight: 'bold' }}>{tracker.name}</Text>
            </Pressable>
        )
    }

    render() {
        if (!this.state.isReady)return (
            <ScrollView style={styles.screenContainer} contentContainerStyle={styles.ajc}>
                <View><Text>Loading...</Text></View>
            </ScrollView>
        )
        return (
            <ScrollView style={styles.screenContainer}>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.trackerPickingModalVisible}
                    onRequestClose={() => {
                        this.toggleTrackerPickingModal();
                    }}
                >
                    <View
                        style={styles.screenContainer}
                    >
                        <Text style={styles.heading}>Pick a tracker</Text>
                    </View>
                </Modal>
                <this.DefaultTrackerRow tracker={this.state.defaultTracker1} id='1'></this.DefaultTrackerRow>
                <this.DefaultTrackerRow tracker={this.state.defaultTracker2} id='2'></this.DefaultTrackerRow>
            </ScrollView>
        )
    }
}
