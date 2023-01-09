import React from 'react';
import {
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryTheme,
    VictoryTooltip,
    VictoryVoronoiContainer
} from "victory-native";
import {transformData, formatDate, getRecordVariance, getRegressionLine} from "./utils";
import styles from "./styles";
import {Text, View} from "react-native";

function getTickFormat(tick) {
    if (typeof tick === 'number') return tick;
    return tick.split('T')[0].slice(2);
}

export default function TrackerChart(props) {
    const data = transformData(props.tracker.records);
    const variance = getRecordVariance(props.tracker.records);
    const [constant, slope] = getRegressionLine(props.tracker.records);
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
                        data: { stroke: "#F44336", strokeWidth: 3 },
                        parent: {border: "1px solid #ccc"}
                    }}
                    data={data}
                    interpolation='monotoneX'
                >
                </VictoryLine>
                <VictoryAxis
                    dependentAxis
                ></VictoryAxis>
                <VictoryAxis
                    // dependentAxis
                    tickValues={props.tracker.records.x.sort()}
                    fixLabelOverlap
                    tickFormat={t => (getTickFormat(t))}
                ></VictoryAxis>
            </VictoryChart>
            <View style={[styles.dashboardTrackerStats]}>
                <View>
                    <Text style={styles.dashboardStat}>{variance}</Text>
                    <Text style={styles.statHeading}>Variance</Text>
                </View>
                <View>
                    <Text style={styles.dashboardStat}>{slope > 0 ? '+' : ''}{slope}/day</Text>
                    <Text style={styles.statHeading}>Trend</Text>
                </View>
            </View>
        </View>
    )
}