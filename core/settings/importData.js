import React from 'react';
import {ScrollView, View, Text, Pressable} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import styles from '../styles';


export default class ImportData extends React.Component {
    state = {
        file: null
    }

    getData = () => {
        DocumentPicker.getDocumentAsync({ type: 'text/csv' })
            .then(result => {
                if (result.type === 'cancel') return;
                this.parseData(result.file);
            });
    }

    parseData = (file) => {

    }

    render() {
        return (
            <ScrollView style={styles.screenContainer}>
                <Text style={styles.heading}>Import data</Text>
                <Text style={[styles.marginTop, styles.warningContainer]}>
                    Choose a .csv file with two columns - one corresponding to the date/date-time
                    of the record and one corresponding to the record.
                </Text>
                <View style={[styles.centeredRow, styles.marginTop]}>
                    <Pressable
                        onPress={this.getData}
                        style={styles.button}
                    >
                        <Text>Choose file</Text>
                    </Pressable>
                </View>
            </ScrollView>
        )
    }
}