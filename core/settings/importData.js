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

    getData = async () => {
        DocumentPicker.getDocumentAsync({ type: 'text/*' })
            .then(result => {
                if (result.type === 'cancel') return;
                this.parseData(result.uri);
            });
    }

    parseData = async (uri) => {
        try {
            const data = await parseCSVFile(uri);
            this.setState({ trackerData: data })
        }
        catch {
            this.setState({ parsingError: true })
        }
    }

    createTracker = async () => {
        if (!this.state.newTrackerName) return;
        if (!this.state.trackerData) await this.getData();
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
                    Choose a .csv file with two columns - date and value. The first column should
                    contain the date, the second column should contain the value.
                </Text>
                {this.state.parsingError ?
                    <Text style={[styles.marginTop, styles.errorContainer]}>
                        An error occurred while reading the file you selected. Please try again with another file (make sure the file is present locally on your device).
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
                {
                    this.state.trackerData ?
                        <View>
                            <Text style={{ textAlign: 'center' }}>File read successfully!</Text>
                        </View>
                        : null
                }
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
                        disabled={!(this.state.newTrackerName && this.state.trackerData)}
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