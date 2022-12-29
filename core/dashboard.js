import React from 'react';
import { Text, ScrollView } from 'react-native';
import styles, { constants } from './styles'


export default class Dashboard extends React.Component {
    render() {
        return (
            <ScrollView style={styles.screenContainer}>
                <Text>Dashboard</Text>
            </ScrollView>
        )
    }
}