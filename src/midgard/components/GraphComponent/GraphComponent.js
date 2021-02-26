import React, { useState, useEffect } from "react";
import {
    VictoryScatter,
    VictoryChart,
    VictoryTheme,
    VictoryTooltip,
    VictoryLine,
    VictoryZoomContainer,
    VictoryAxis,
  } from 'victory';
import _ from "lodash";
import moment from "moment";

export function GraphComponent(props) {
  const { data, maxPoints } = props;
  const [zoomedXDomain, setZoomedXDomain] = useState([]);
  const [domain,setDomain] = useState({
    y: [_.minBy(data, d => d.y).y, _.maxBy(data, d => d.y).y],
    x: [ data[0].x, _.last(data).x ],
    axis: [_.minBy(data, d => d.x).x, _.maxBy(data, d => d.x).x],
  });
  const [renderedData, setRenderedData] = useState(data);

  useEffect(() => {
    if (data && data.length) {
      setZoomedXDomain(domain.x)
    }
  },[zoomedXDomain]);

  const getData = () => {
    const filtered = data.filter(
    	(d) => (d.x >= zoomedXDomain[0] && d.x <= zoomedXDomain[1]));

    if (filtered.length > maxPoints ) {
      const k = Math.ceil(filtered.length / maxPoints);
    	return filtered.filter(
      	(d, i) => ((i % k) === 0)
      );
    }
    return filtered;
  }

  const handleZoomChange = () => {
    setZoomedXDomain(domain.x)
    setRenderedData(getData())
  }

  // const renderedData = getData();
  return (
    <div>
        { data && data.length > 0 ? (
        <VictoryChart
          domain={domain}
          containerComponent={<VictoryZoomContainer
            zoomDimension="x"
            theme={VictoryTheme.material}
            responsive={true}
            onZoomDomainChange={() => handleZoomChange()}
            minimumZoom={{x: 1/10000}}
          />}
        >
          <VictoryScatter data={renderedData}
          style={{data: { fill: "#EBC645" }, labels: { fill: "#EBC645" }}}
          size={({ active }) => active ? 5 : 3}
          labels={({ datum, selectedGraph }) => (`${selectedGraph} - ${datum.y}`)}
          labelComponent={<VictoryTooltip />} />
          <VictoryLine data={renderedData} />
          <VictoryAxis
              tickValues={domain.axis}
              tickFormat={(t) => `${moment(t).format('MMM-DD')}`}
              fixLabelOverlap={true}
          />
        </VictoryChart>) :
        <div> No data to display </div>}
      </div>
    );
  }
