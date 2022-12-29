import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from './core/styles'
import HomeTabNavigation from "./core/homeTabNavigation";

export default function App() {
    return (
        <HomeTabNavigation></HomeTabNavigation>
    );
}