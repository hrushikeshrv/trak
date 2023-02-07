import React from 'react';
import {Text, View, FlatList, Modal, Pressable, TextInput} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";

import styles from './styles'
import {formatDate} from "./utils";

class TrackerRecordList extends React.Component {
    state = {
        editRecordModalVisible: false,
        editingDate: null,
        editingRecord: null,
        dateTimePickerVisible: false,
    }

    componentDidMount() {
        const { tracker } = this.props.route.params;
        const data = [];
        for (let i = 0; i < tracker.records.x.length; i++) {
            data.push([tracker.records.x[i], tracker.records.y[i], i]);
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
                        this.setState({ editingDate: item[0], editingRecord: item[1] }, () => {
                            console.log(this.state.editingRecord);
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
                            value={this.state.editingRecord}
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
                            onConfirm={() => {}}
                            onCancel={this.toggleDateTimePickerVisible}
                            isVisible={this.state.dateTimePickerVisible}
                            mode='datetime'
                        ></DateTimePicker>
                        <Pressable
                            style={[styles.simpleButton, styles.marginTop]}
                            onPress={() => {
                                this.setState({ editingDate: null, editingRecord: null })
                                this.toggleEditRecordModal()
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