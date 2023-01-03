import React from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';

import styles from './styles'
import {formatDate} from "./utils";

class TrackerRecordList extends React.Component {
    renderRow = item => {
        return (
            <RecordRow record={item}></RecordRow>
        )
    }

    render() {
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
        return (
            <View style={styles.screenContainer}>
                <Text style={styles.heading}>{tracker.name}</Text>
                <FlatList
                    data={data}
                    renderItem={this.renderRow}
                    style={{ marginTop: 20, padding: 10, paddingBottom: 20 }}
                ></FlatList>
            </View>
        )
    }
}

function RecordRow(record) {
    record = record.record.item;
    const x = new Date(record[0]);
    const y = record[1];
    return (
        <View style={[styles.row, styles.jcsb, styles.recordRow]} key={record[2]}>
            <Text style={{fontFamily: 'monospace'}}>{formatDate(x)}</Text>
            <Text style={{fontFamily: 'monospace', fontSize: 18}}>{y}</Text>
        </View>
    )
}

export default function({ route, navigation }) {
    return <TrackerRecordList route={route} navigation={navigation}></TrackerRecordList>
}