import React from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme, VictoryVoronoiContainer} from "victory-native";
import {transformData} from "./utils";

function getTickFormat(tick) {
    if (typeof tick === 'number') return tick;
    return tick.split('T')[0].slice(2);
}

export default function TrackerChart(props) {
    const data = transformData(props.tracker.records);
    return (
        <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={{x: [10, 10], y: [10, 20]}}
            containerComponent={
                <VictoryVoronoiContainer
                    voronoiDimension="x"
                    labels={ ({ datum }) => `${datum.y}` }
                />
            }
        >
            <VictoryLine
                style={{
                    data: { stroke: "tomato" },
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
    )
}