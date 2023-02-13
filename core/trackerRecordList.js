import React from 'react';
import {Text, View, FlatList, Modal, Pressable, TextInput} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";

import styles from './styles'
import {formatDate} from "./utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

class TrackerRecordList extends React.Component {
    state = {
        editRecordModalVisible: false,
        editingDate: null,
        editingRecord: null,
        newDate: null,
        newRecord: null,
        dateTimePickerVisible: false,
    }

    componentDidMount() {
        this.updateData();
    }

    updateData = (tracker=null) => {
        if (tracker === null)
            tracker = this.props.route.params.tracker;
        const data = [];
        for (let i = 0; i < tracker.records.length; i++) {
            data.push([tracker.records[i].x, tracker.records[i].y, i]);
        }
        data.sort((a, b) => {
            const d1 = new Date(a[0]);
            const d2 = new Date(b[0]);
            if (d1 < d2) return -1;
            if (d1 > d2) return 1;
            return 0;
        })

        this.setState({data: data, tracker: tracker})
    }

    toggleEditRecordModal = () => {
        this.setState(prevState => ({editRecordModalVisible: !prevState.editRecordModalVisible}))
    }

    toggleDateTimePickerVisible = () => {
        this.setState(prevState => ({dateTimePickerVisible: !prevState.dateTimePickerVisible}))
    }

    renderRow = item => {
        item = item.item;
        const x = new Date(item[0]);
        const y = item[1];
        return (
            <View>
                <Pressable
                    key={item[2]}
                    style={[styles.row, styles.jcsb, styles.recordRow]}
                    onPress={() => {
                        console.log('Pressed');
                        this.setState({
                            editingDate: new Date(item[0]),
                            editingRecord: item[1],
                            newDate: new Date(item[0]),
                            newRecord: item[1],
                        }, () => {
                            console.log(this.state.editingRecord);
                            console.log(this.state.editingDate);
                            this.toggleEditRecordModal();
                        })
                    }}
                >
                    <Text style={{fontFamily: 'monospace'}}>{formatDate(x)}</Text>
                    <Text style={{fontFamily: 'monospace', fontSize: 18}}>{y}</Text>
                </Pressable>
            </View>
        )
    }

    replaceRecord = async (oldRecord, oldDate, newRecord, newDate) => {
        const trackers = JSON.parse(await AsyncStorage.getItem('Trackers'));
        for (let tracker of trackers) {
            if (tracker.id === this.state.tracker.id) {
                for (let i = 0; i < tracker.records.length; i++) {
                    if (tracker.records[i].x.toString() === oldDate.toISOString()
                        && tracker.records[i].y.toString() === oldRecord.toString()) {
                        tracker.records[i].x = newDate;
                        tracker.records[i].y = parseFloat(newRecord);
                        break;
                    }
                }
                break;
            }
        }

        await AsyncStorage.setItem('Trackers', JSON.stringify(trackers));
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <Text style={styles.heading}>{this.state.tracker?.name}</Text>
                <Modal
                    animationType='slide'
                    visible={this.state.editRecordModalVisible}
                    onRequestClose={() => {this.toggleEditRecordModal()}}
                    transparent={true}
                >
                    <View style={styles.screenContainer}>
                        <Text style={[styles.marginBottom, {fontSize: 18, fontWeight: 'bold'}]}>Record:</Text>
                        <TextInput
                            keyboardType="numeric"
                            value={this.state.newRecord?.toString()}
                            onChangeText={text => {
                                this.setState({ newRecord: text })
                            }}
                            style={styles.textInput}
                        ></TextInput>

                        <Text style={[styles.marginBottom, styles.marginTop, {fontSize: 18, fontWeight: 'bold'}]}>Date:</Text>
                        <Pressable
                            style={styles.textInput}
                            onPress={this.toggleDateTimePickerVisible}
                        >
                            <Text>{formatDate(this.state.editingDate)}</Text>
                        </Pressable>
                        <DateTimePicker
                            onConfirm={date => {this.setState({ newDate: date })}}
                            onCancel={this.toggleDateTimePickerVisible}
                            isVisible={this.state.dateTimePickerVisible}
                            mode='datetime'
                        ></DateTimePicker>
                        <Pressable
                            style={[styles.simpleButton, styles.marginTop]}
                            onPress={() => {
                                if (!this.state.newDate || !this.state.newRecord) return;
                                this.replaceRecord(this.state.editingRecord, this.state.editingDate, this.state.newRecord, this.state.newDate);
                                this.toggleEditRecordModal();
                                this.setState({ editingDate: null, editingRecord: null, newDate: null, newRecord: null });
                                console.log('Updating data')
                                AsyncStorage.getItem('Trackers')
                                    .then(trackers => {
                                        trackers = JSON.parse(trackers);
                                        for (let tracker of trackers) {
                                            if (tracker.id === this.state.tracker.id) {
                                                this.setState({tracker});
                                                this.updateData(tracker);
                                                break;
                                            }
                                        }
                                    })
                            }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center' }}>Done</Text>
                        </Pressable>
                    </View>
                </Modal>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderRow}
                    style={{ marginTop: 20, padding: 10, paddingBottom: 20 }}
                ></FlatList>
            </View>
        )
    }
}

function RecordRow(record) {

}

export default function({ route, navigation }) {
    return <TrackerRecordList route={route} navigation={navigation}></TrackerRecordList>
}