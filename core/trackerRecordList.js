import React from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';

class TrackerRecordList extends React.Component {
    render() {
        console.log(this.props);
        return (
            <Text>{this.props.tracker.name}</Text>
        )
    }
}

export default function({ route, navigation, tracker }) {
    return <TrackerRecordList route={route} navigation={navigation} tracker={tracker}></TrackerRecordList>
}