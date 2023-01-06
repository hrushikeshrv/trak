import React from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';
import styles from './styles'
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";


class NewTracker extends React.Component {
    state = {
        trackerName: ''
    }
    onChangeText = trackerName => {
        this.setState({ trackerName })
    }

    createTracker = async () => {
        const tracker = {
            name: this.state.trackerName,
            graphType: 'line',
            records: {
                x: [],
                y: []
            }
        }
        let maxId = 0;
        AsyncStorage.getItem('Trackers')
            .then(trackers => {
                trackers = JSON.parse(trackers);
                if (!trackers) trackers = [];
                trackers.forEach(t => {if (t.id > maxId) maxId = t.id});
                tracker.id = maxId + 1;
                trackers.push(tracker);
                AsyncStorage.setItem('Trackers', JSON.stringify(trackers))
                    .then(() => {
                        const { navigation } = this.props;
                        navigation.navigate('ListTrackers');
                    })
                    .catch(err => {console.error(err)})
            })
    }
    render() {
        return (
            <View style={[styles.screenContainer, styles.ajc]}>
                <TextInput
                    placeholder='Tracker Name'
                    style={styles.textInput}
                    onChangeText={this.onChangeText}
                ></TextInput>
                <Pressable
                    style={[styles.button, styles.marginTop]}
                    onPress={this.createTracker}
                >
                    <View style={styles.centeredRow}>
                        <Ionicons name='add-outline' size={20} color='black'></Ionicons>
                        <Text style={{ fontSize: 20 }}>Create Tracker</Text>
                    </View>
                </Pressable>
            </View>
        )
    }
}

export default function() {
    const navigation = useNavigation();
    return <NewTracker navigation={navigation}></NewTracker>
}