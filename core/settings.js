import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles'


export default class Settings extends React.Component {
    render() {
        return (
            <View style={styles.screenContainer}>
                <Text>Settings</Text>
            </View>
        )
    }
}