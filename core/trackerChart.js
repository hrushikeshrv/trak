import React from 'react';
import {
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryPie,
    VictoryTheme,
    VictoryTooltip,
    VictoryVoronoiContainer,
    VictoryLabel
} from "victory-native";
import {transformData, formatDate, getRecordVariance, getRegressionLine, getRecordDelta} from "./utils";
import styles from "./styles";
import {Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

function getTickFormat(tick) {
    if (typeof tick === 'number') return tick;
    return tick.split('T')[0].slice(2);
}

export default class TrackerChart extends React.Component {
    state = {
        isReady: false,
    }

    componentDidMount() {
        const data = transformData(this.props.tracker.records);
        const variance = getRecordVariance(this.props.tracker.records);
        const [constant, slope] = getRegressionLine(this.props.tracker.records);
        const delta = getRecordDelta(this.props.tracker.records);
        this.setState({ data, variance, slope, constant, delta });
        // Delay setting isReady so navigation to the screen can complete before
        // the chart tries to render.
        setTimeout(() => {this.setState({ isReady: true })}, 150);
    }

    loadingScreenComponent = () => {
        return (
            <View>
                <VictoryPie
                    data={[
                        { x: 1, y: 5 },
                        { x: 2, y: 4 },
                    ]}
                    innerRadius={70}
                    width={350}
                    height={350}
                    labelRadius={0}
                    style={{ labels: { fontSize: 20, fill: "white" } }}
                    labelComponent={
                        <VictoryLabel
                            textAnchor="middle"
                            style={{ fontSize: 16, color: 'black', fontFamily: 'monospace' }}
                            x={175} y={175}
                            text="Loading..."
                        />
                    }
                />
            </View>
        )
    }

    chartComponent = () => {
        const data = this.state.data;
        const largeDataSet = data.length >= 100;
        const interval = Math.ceil(data.length / 50);
        const sampledData = data.filter((d, i) => ((i % interval) === 0));
        return (
            <View>
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{x: [10, 20], y: [10, 20]}}
                    containerComponent={
                        <VictoryVoronoiContainer
                            voronoiDimension="x"
                            labels={ ({ datum }) => `${datum.y}\n${formatDate(new Date(datum.date))}` }
                            labelComponent={
                                <VictoryTooltip
                                    constrainToVisibleArea
                                    style={{ fill: 'white', fontWeight: 'bold' }}
                                    flyoutStyle={{ fill: '#13191C' }}
                                ></VictoryTooltip>
                            }
                        />
                    }
                >
                    <VictoryLine
                        style={{
                            data: { stroke: this.props.tracker.stroke || "#F44336" , strokeWidth: 3 },
                            parent: {border: "1px solid #ccc"}
                        }}
                        data={data}
                        interpolation={largeDataSet ? 'bundle' : 'monotoneX'}
                    >
                    </VictoryLine>
                    <VictoryAxis dependentAxis></VictoryAxis>
                    <VictoryAxis
                        tickValues={this.props.tracker.records.x.sort()}
                        tickCount={4}
                        fixLabelOverlap
                        tickFormat={t => (getTickFormat(t))}
                    ></VictoryAxis>
                </VictoryChart>
                {
                    largeDataSet
                    ? (<VictoryChart height={140} width={370} style={{
                            parent: {
                                marginTop: -40,
                                marginBottom: -40
                            }
                        }}>
                        <VictoryAxis tickFormat={() => ('')}></VictoryAxis>
                        <VictoryLine
                            style={{
                                data: { stroke: this.props.tracker.stroke || "#F44336" , strokeWidth: 3 },
                                parent: {border: "1px solid #ccc"}
                            }}
                            data={sampledData}
                            interpolation='monotoneX'
                        >
                        </VictoryLine>
                        </VictoryChart>)
                    : null
                }
            </View>
        )
    }

    render() {
        const variance = this.state.variance;
        const slope = this.state.slope;
        const delta = this.state.delta;
        return (
            <View>
                { this.state.isReady ? this.chartComponent() : this.loadingScreenComponent() }
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
}