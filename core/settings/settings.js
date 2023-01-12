import React from 'react';
import { Text, ScrollView, View, Pressable, Modal, FlatList } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import styles from '../styles'


class Settings extends React.Component {
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
        if (!settings || Object.keys(settings).length === 0) {
            AsyncStorage.setItem('Settings', JSON.stringify({}))
                .then(() => {
                    settings = {}
                });
        }
        AsyncStorage.getItem('Trackers')
            .then(trackers => {
                trackers = JSON.parse(trackers);
                if (!trackers) return;
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
        const { navigation } = this.props;
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
                <Text style={[styles.settingsHeader, { marginTop: 10 }]}>Set your default trackers</Text>
                <this.DefaultTrackerRow tracker={this.state.defaultTracker1} id={1}></this.DefaultTrackerRow>
                <this.DefaultTrackerRow tracker={this.state.defaultTracker2} id={2}></this.DefaultTrackerRow>

                <Text style={styles.settingsHeader}>Your data</Text>
                <Pressable
                    style={styles.settingsRow}
                    onPress={() => {navigation.navigate('ImportData')}}
                >
                    <Text style={{ fontWeight: 'bold' }}>Import Data</Text>
                </Pressable>
                <Pressable
                    style={styles.settingsRow}
                    onPress={() => {}}
                >
                    <Text style={{ fontWeight: 'bold' }}>Export Data</Text>
                </Pressable>
                <Pressable
                    style={styles.settingsRow}
                    onPress={() => {}}
                >
                    <Text style={{ fontWeight: 'bold' }}>Clean Tracker Data</Text>
                </Pressable>
                <Pressable
                    style={styles.settingsRow}
                    onPress={() => {}}
                >
                    <Text style={{ fontWeight: 'bold' }}>Privacy Policy</Text>
                </Pressable>

                <Text style={styles.settingsHeader}>Notifications</Text>
                <Pressable
                    style={styles.settingsRow}
                    onPress={() => {}}
                >
                    <Text style={{ fontWeight: 'bold' }}>Manage Notifications</Text>
                </Pressable>

                <Text style={styles.settingsHeader}>Help</Text>
                <Pressable
                    style={styles.settingsRow}
                    onPress={() => {}}
                >
                    <Text style={{ fontWeight: 'bold' }}>Report an issue</Text>
                </Pressable>
                <Pressable
                    style={styles.settingsRow}
                    onPress={() => {}}
                >
                    <Text style={{ fontWeight: 'bold' }}>Contact Developers</Text>
                </Pressable>
                <Pressable
                    style={styles.settingsRow}
                    onPress={() => {}}
                >
                    <Text style={{ fontWeight: 'bold' }}>Terms of service</Text>
                </Pressable>

                <View style={{ padding: 30 }}></View>
            </ScrollView>
        )
    }
}

export default function() {
    const navigation = useNavigation();
    return <Settings navigation={navigation}></Settings>
}
