import React from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from "victory-native";
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
        >
            <VictoryLine
                style={{
                    data: { stroke: "tomato" },
                    parent: {border: "1px solid #ccc"}
                }}
                data={data}
                interpolation='monotoneX'
                labels={({datum}) => datum.y}
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