import React from 'react';
import {Text, TextInput, View, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from './styles'

function UpdateTrackerList({ onUpdate }) {
    useFocusEffect(React.useCallback(() => {
        onUpdate()
    }, []))
    return null;
}

class TrackerList extends React.Component {
    state = {
        trackers: [],
        searchTerm: '',
    }

    componentDidMount() {
        this.updateTrackerList();
    }

    updateTrackerList = () => {
        AsyncStorage.getItem('Trackers')
            .then(trackers => {
                this.setState(prevState => ({trackers: JSON.parse(trackers)}))
            })
    }

    searchTracker = searchTerm => {
        this.setState({ searchTerm })
    }

    renderTrackerTile = (item) => {
        const { navigation } = this.props;
        return (
            <Pressable
                onPress={() => {navigation.navigate('DetailTracker', {tracker: item})}}
                style={styles.trackerTile} key={item.id}
            >
                <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold' }}>{item.name}</Text>
            </Pressable>
        )
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.screenContainer}>
                <Text style={[styles.heading, styles.marginBottom]}>My Trackers</Text>
                <UpdateTrackerList onUpdate={this.updateTrackerList}></UpdateTrackerList>
                <View style={[styles.centeredRow]}>
                    <Pressable
                        onPress={() => {navigation.navigate('AddRecord')}}
                        style={styles.button}
                    >
                        <View style={styles.centeredRow}>
                            <Ionicons name='add-outline' size={20} color='black'></Ionicons>
                            <Text style={{ fontSize: 20 }}>Add Record</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        onPress={() => {navigation.navigate('NewTracker')}}
                        style={styles.button}
                    >
                        <View style={styles.centeredRow}>
                            <Ionicons name='trending-up-sharp' size={20} color='black' style={{ marginRight: 5 }}></Ionicons>
                            <Text style={{ fontSize: 20 }}>New Tracker</Text>
                        </View>
                    </Pressable>
                </View>
                <TextInput
                    style={[styles.textInput]}
                    placeholder='Search'
                    onChangeText={this.searchTracker}
                ></TextInput>
                <ScrollView
                    contentContainerStyle={{alignItems: 'center', paddingTop: 20}}
                >
                    {this.state.trackers.map(this.renderTrackerTile)}
                </ScrollView>
            </View>
        )
    }
}

export default function() {
    const navigation = useNavigation();
    return <TrackerList navigation={navigation}></TrackerList>
}
