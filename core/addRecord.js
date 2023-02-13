import React, { useState } from 'react';
import {Pressable, Text, TextInput, View, ScrollView } from 'react-native';
import styles from './styles'
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "react-native-modal-datetime-picker";

import { formatDate } from "./utils";


class AddRecord extends React.Component {
    state = {
        trackers: [],
        datePickerVisible: false,
        date: 'Set date & time',
        readings: []
    }

    componentDidMount() {
        AsyncStorage.getItem('Trackers')
            .then(trackers => {
                this.setState(prevState => ({trackers: JSON.parse(trackers)}))
            })
    }

    toggleDatePicker = () => {
        this.setState(prevState => ({datePickerVisible: !prevState.datePickerVisible}))
    }

    setDate = date => {
        this.setState({date: date})
    }

    saveRecord = () => {
        if (typeof this.state.date === 'string') return;
        const trackers = JSON.parse(JSON.stringify(this.state.trackers)); // Deep copy trackers
        for (let i = 0; i < this.state.readings.length; i++) {
            const reading = this.state.readings[i];
            for (let j = 0; j < trackers.length; j++) {
                if (trackers[j].id === reading.id) {
                    trackers[j].records.push({x: this.state.date, y: reading.value})
                }
            }
        }
        AsyncStorage.setItem('Trackers', JSON.stringify(trackers))
            .then(() => {
                const { navigation } = this.props;
                navigation.navigate('ListTrackers');
            })
            .catch(err => {
                console.error(err);
            })
    }

    renderTrackerInput = item => {
        return (
            <View key={item.id}>
                <Text style={[styles.small, styles.marginTop]}>
                    {item.name}:
                </Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType='numeric'
                    onChangeText={text => {
                        if (isNaN(text) || isNaN(parseFloat(text))) return;
                        let reading = null;
                        this.state.trackers.forEach(t => {
                            if (t.id === item.id) {
                                reading = {id: item.id, value: parseFloat(text)};
                            }
                        })
                        const newReadings = this.state.readings.filter(r => (r.id !== reading.id));
                        newReadings.push(reading);
                        this.setState({readings: newReadings})
                    }}
                >
                </TextInput>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <DateTimePicker
                    isVisible={this.state.datePickerVisible}
                    mode="datetime"
                    onConfirm={this.setDate}
                    onCancel={this.toggleDatePicker}
                ></DateTimePicker>
                <Text style={styles.heading}>Add A Record</Text>
                <ScrollView contentContainerStyle={{alignItems: 'center', paddingTop: 20}}>
                    {this.state.trackers.map(this.renderTrackerInput)}
                    <View style={styles.centeredRow}>
                        <Pressable
                            onPress={this.toggleDatePicker}
                            style={[styles.button, styles.ajc, styles.marginTopDouble]}
                        >
                            <Text style={styles.bold}>{formatDate(this.state.date)}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.ajc, styles.marginTopDouble]}
                            onPress={this.saveRecord}
                        >
                            <Text style={styles.bold}>Save Record</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default function() {
    const navigation = useNavigation();
    return <AddRecord navigation={navigation}></AddRecord>
}