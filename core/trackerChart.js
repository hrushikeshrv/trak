import React from 'react';
import {
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryTheme,
    VictoryTooltip,
    VictoryVoronoiContainer
} from "victory-native";
import {transformData, formatDate, getRecordVariance, getRegressionLine, getRecordDelta} from "./utils";
import styles from "./styles";
import {Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

function getTickFormat(tick) {
    if (typeof tick === 'number') return tick;
    return tick.split('T')[0].slice(2);
}

export default function TrackerChart(props) {
    const data = transformData(props.tracker.records);
    const variance = getRecordVariance(props.tracker.records);
    const [constant, slope] = getRegressionLine(props.tracker.records);
    const delta = getRecordDelta(props.tracker.records);
    return (
        <View>
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{x: [10, 20], y: [10, 20]}}
                containerComponent={
                    <VictoryVoronoiContainer
                        voronoiDimension="x"
                        labels={ ({ datum }) => `${datum.y}\n${formatDate(new Date(datum.date))}` }
                        labelComponent={<VictoryTooltip constrainToVisibleArea></VictoryTooltip>}
                    />
                }
            >
                <VictoryLine
                    style={{
                        data: { stroke: props.tracker.stroke || "#F44336" , strokeWidth: 3 },
                        parent: {border: "1px solid #ccc"}
                    }}
                    data={data}
                    interpolation='monotoneX'
                >
                </VictoryLine>
                <VictoryAxis dependentAxis></VictoryAxis>
                <VictoryAxis
                    tickValues={props.tracker.records.x.sort()}
                    fixLabelOverlap
                    tickFormat={t => (getTickFormat(t))}
                ></VictoryAxis>
            </VictoryChart>
            <View style={[styles.dashboardTrackerStats]}>
                <View>
                    <View style={styles.centeredRow}>
                        <Ionicons
                            name={delta > 0 ? 'arrow-up' : (delta === 0 ? 'reorder-two' : 'arrow-down')}
                            size={12}
                            color='#FDD835'
                        ></Ionicons>
                        <Text style={styles.dashboardStat}>{delta}</Text>
                    </View>
                    <Text style={styles.statHeading}>Delta</Text>
                </View>
                <View>
                    <Text style={styles.dashboardStat}>{variance}</Text>
                    <Text style={styles.statHeading}>Variance</Text>
                </View>
                <View>
                    <View style={styles.centeredRow}>
                        <Ionicons
                            name={slope > 0 ? 'arrow-up' : (slope === 0 ? 'reorder-two' : 'arrow-down')}
                            size={12}
                            color='#FDD835'
                        ></Ionicons>
                        <Text style={styles.dashboardStat}>{slope}</Text>
                        <Text style={{ color: 'white' }}>/day</Text>
                    </View>
                    <Text style={styles.statHeading}>Trend</Text>
                </View>
            </View>
        </View>
    )
}