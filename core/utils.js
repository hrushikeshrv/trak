import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';

export const formatDate = date => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    const words = date.toString().split(' ');
    let time = words[4].split(':');
    if (parseInt(time[0]) > 12) {
        time[0] = parseInt(time[0]) - 12;
        time[1] += ' PM'
    }
    else {
        time[1] += ' AM'
    }
    return `${words[1]} ${words[2]} ${words[3]}, ${time[0]}:${time[1]}`;
}


export const getRegressionLine = records => {
    let dateIndices;
    const n = records.length;
    const x_vals = [];
    const y_vals = [];
    for (let record of records) {
        x_vals.push(record.x);
        y_vals.push(record.y);
    }
    if (n <= 1) return [0, 0];

    if (typeof x_vals[0] !== 'number') {
        dateIndices = [0];
        const d1 = new Date(x_vals[0]);
        for (let i = 1; i < n; i++) {
            const d2 = new Date(x_vals[i]);
            let dateDiff = Math.round((d2 - d1) / (1000 * 24 * 60 * 60))
            dateDiff = dateDiff === 0 ? dateDiff + 1 : dateDiff;
            dateIndices.push(dateDiff);
        }
    }
    else dateIndices = x_vals;
    const x_mean = dateIndices.reduce((partialSum, a) => partialSum + a) / n;
    const y_mean = y_vals.reduce((partialSum, a) => partialSum + a) / n;
    let xi_yi = 0;
    let xi_2 = 0;
    for (let i = 0; i < n; i++) {
        xi_yi += dateIndices[i] * y_vals[i];
        xi_2 += dateIndices[i] ** 2;
    }
    const B = (xi_yi - n * x_mean * y_mean) / (xi_2 - n * x_mean * x_mean); // Regression coefficient B
    const A = y_mean - B * x_mean;  // Regression coefficient A
    return [roundNumber(A, 2), roundNumber(B, 3)];
}

export const getRecordVariance = records => {
    if (records.length === 0) return 0;
    const values = [];
    for (let record of records) values.push(record.y);
    let mean = values.reduce((partialSum, a) => partialSum + a) / values.length;
    let variance = 0;
    for (let i = 0; i < values.length; i++) {
        variance += (values[i] - mean) ** 2;
    }
    return roundNumber(Math.sqrt(variance) / values.length, 3);
}

export const getRecordDelta = records => {
    const x_vals = [];
    const y_vals = [];
    for (let record of records) {
        x_vals.push(record.x);
        y_vals.push(record.y);
    }
    if (y_vals.length <= 1) return 0;
    let minDate = new Date(x_vals[0]);
    let maxDate = new Date(x_vals[0]);
    let max = 0;
    let min = 0;
    for (let i = 0; i < x_vals.length; i++) {
        const d = new Date(x_vals[i]);
        if (d >= maxDate) {
            maxDate = d;
            max = y_vals[i];
        }
        if (d <= minDate) {
            minDate = d;
            min = y_vals[i];
        }
    }
    return roundNumber(max - min, 2);
}

export const roundNumber = (n, places) => {
    const factor = 10 ** places;
    // Very basic rounding. Misses some edge cases, but
    // that's okay for this application.
    return Math.round(n * factor) / factor;
}

export const createTracker = async (name, records = null) => {
    const tracker = {
        name: name,
        graphType: 'line',
        records: []
    }
    if (records) tracker.records = records;

    let maxId = 0;
    let trackers = JSON.parse(await AsyncStorage.getItem('Trackers'));
    if (!trackers) trackers = [];
    trackers.forEach(t => {if (t.id > maxId) maxId = t.id});
    tracker.id = maxId + 1;
    trackers.push(tracker);
    return await AsyncStorage.setItem('Trackers', JSON.stringify(trackers))
}

export const parseCSVFile = async uri => {
    const fileContents = await FileSystem.readAsStringAsync(uri);
    const lines = fileContents.split('\n');
    lines.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    })

    const records = []
    for (let line of lines) {
        line = line.split(',');
        const d = new Date(line[0]);
        const val = parseFloat(line[1]);
        if (isNaN(val) || isNaN(d.valueOf())) continue;
        records.push({x: d, y: val});
    }
    return records;
}

export const addRecordToTracker = (record, date, trackerId) => {

}