import React from 'react';
import {ScrollView, View, Text, Pressable, TextInput} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import {parseCSVFile, createTracker} from "../utils";
import styles from '../styles';
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";


class ImportData extends React.Component {
    state = {
        file: null,
        newTrackerName: '',
        trackerData: null,
        parsingError: false,
    }

    getData = () => {
        DocumentPicker.getDocumentAsync({ type: 'text/csv' })
            .then(result => {
                if (result.type === 'cancel') return;
                this.parseData(result.file);
            });
    }

    parseData = (file) => {
        try {
            console.log('Parsing file ', file.file);
            this.setState({ trackerData: parseCSVFile(file) })
        }
        catch {
            this.setState({ parsingError: true })
        }
    }

    createTracker = () => {
        if (!this.state.newTrackerName || !this.state.trackerData) return;
        const { navigation } = this.props;
        createTracker(this.state.newTrackerName, this.state.trackerData)
            .then(() => {
                navigation.goBack();
            })
    }

    render() {
        return (
            <ScrollView style={styles.screenContainer}>
                <Text style={styles.heading}>Import data</Text>
                <Text style={[styles.marginTop, styles.warningContainer]}>
                    Choose a .csv file with two columns - one corresponding to the date/date-time
                    of the record and one corresponding to the record.
                </Text>
                {this.state.parsingError ?
                    <Text style={[styles.marginTop, styles.errorContainer]}>
                        The file you selected is not in the correct format. Please try again with another file.
                    </Text>
                    : null
                }
                <View style={[styles.centeredRow, styles.marginTop]}>
                    <Pressable
                        onPress={this.getData}
                        style={styles.button}
                    >
                        <Text>Choose file</Text>
                    </Pressable>
                </View>
                <View
                    style={[styles.padding20]}
                >
                    <TextInput
                        placeholder='New tracker name'
                        style={styles.textInput}
                        onChangeText={text => {this.setState({ newTrackerName: text })}}
                        value={this.state.newTrackerName}
                    ></TextInput>
                </View>
                <View style={[styles.padding20, styles.ajc]}>
                    <Pressable
                        style={[styles.simpleButton, styles.centeredRow]}
                        onPress={this.createTracker}
                    >
                        <Ionicons name='trending-up-sharp' size={20} color='white' style={{ marginRight: 8 }}></Ionicons>
                        <Text style={{ color: 'white' }}>Create Tracker</Text>
                    </Pressable>
                </View>
            </ScrollView>
        )
    }
}

export default function() {
    const navigation = useNavigation();
    return <ImportData navigation={navigation}></ImportData>
}