import React from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';
import HomeTabNavigation from "./core/homeTabNavigation";
import styles from './core/styles';


export default class App extends React.Component {
    state = {
        fontsLoaded: false,
    }

    loadFontsAsync = async () => {
        Font.loadAsync({
            Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
            AlfaSlabOne: require('./assets/fonts/AlfaSlabOne-Regular.ttf'),
        })
            .then(() => {
                this.setState({ fontsLoaded: true });
            })
    }

    componentDidMount() {
        this.loadFontsAsync();
    }

    render() {
        if (!this.state.fontsLoaded) return <View style={[styles.screenContainer, styles.ajc]}><Text>Loading...</Text></View>
        return <HomeTabNavigation></HomeTabNavigation>;
    }
}