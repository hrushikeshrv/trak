import React from 'react';
import { Text, ScrollView, View, Pressable, Modal, FlatList } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../styles'


export default class Settings extends React.Component {
    state = {
        isReady: false,
        defaultTracker1: null,
        defaultTracker2: null,
        trackers: null,
        trackerPickingModalVisible: false,
        settingTrackerNumber: null,
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

    toggleTrackerPickingModal = (settingTrackerNumber = null) => {
        this.setState(prevState => ({
            trackerPickingModalVisible: !prevState.trackerPickingModalVisible,
        }))
        if (settingTrackerNumber) {
            this.setState({settingTrackerNumber});
        }
    }

    DefaultTrackerRow = ({ tracker, id }) => {
        if (!tracker) return (
            <Pressable
                style={styles.settingsRow}
                onPress={() => {this.toggleTrackerPickingModal(id)}}
            >
            <Text>Choose Default Tracker {id}</Text>
            </Pressable>
        )
        return (
            <Pressable
                style={styles.settingsRow}
                onPress={() => {this.toggleTrackerPickingModal(id)}}
            >
            <Text style={{ fontWeight: 'bold' }}>{tracker.name}</Text>
            </Pressable>
        )
    }

    setDefaultTrackerAsync = async (id) => {
        const settings = JSON.parse(await AsyncStorage.getItem('Settings'));
        if (this.state.settingTrackerNumber === 1) {
            settings.defaultTracker1 = id;
            for (let i = 0; i < this.state.trackers.length; i++) {
                if (this.state.trackers[i].id === id) {
                    this.setState({defaultTracker1: this.state.trackers[i]});
                    break;
                }
            }
        }
        else {
            settings.defaultTracker2 = id;
            for (let i = 0; i < this.state.trackers.length; i++) {
                if (this.state.trackers[i].id === id) {
                    this.setState({defaultTracker2: this.state.trackers[i]});
                    break;
                }
            }
        }
        AsyncStorage.setItem('Settings', JSON.stringify(settings));
    }

    renderTrackerRow = ({ item }) => {
        return (
            <Pressable
                style={[styles.settingsRow]}
                onPress={() => {
                    this.setDefaultTrackerAsync(item.id)
                        .then(() => this.toggleTrackerPickingModal());
                }}
            >
                <Text>{item.name}</Text>
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

                        <FlatList
                            data={this.state.trackers}
                            renderItem={this.renderTrackerRow}
                            keyExtractor={item => item.id}
                        ></FlatList>

                        <Pressable
                            style={[styles.simpleButton, styles.marginTop]}
                            onPress={this.toggleTrackerPickingModal}
                        ><Text style={{ color: 'white', textAlign: 'center' }}>Done</Text></Pressable>
                    </View>
                </Modal>
                <Text style={{ margin: 6 }}>Set your default trackers</Text>
                <this.DefaultTrackerRow tracker={this.state.defaultTracker1} id={1}></this.DefaultTrackerRow>
                <this.DefaultTrackerRow tracker={this.state.defaultTracker2} id={2}></this.DefaultTrackerRow>
            </ScrollView>
        )
    }
}
