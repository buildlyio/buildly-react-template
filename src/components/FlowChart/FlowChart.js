import React, { useState } from 'react';

import Flowchart from 'flowchart-react';

const FlowChartComponent = () => {
  const [nodes, setNodes] = useState([
    {
      type: 'operation',
      title: 'FE Web-app',
      x: 10,
      y: 50,
      id: 1,
    },
    {
      type: 'operation',
      title: 'Mobile App',
      x: 180,
      y: 50,
      id: 2,
    },
    {
      x: 350,
      y: 50,
      id: 3,
      title: 'Data Service',
      type: 'operation',
    },
    {
      x: 180,
      y: 150,
      id: 4,
      title: () => {
        return 'Buildly GateWay';
      },
      type: 'operation',
    },
    {
      type: 'operation',
      title: 'Service 1',
      x: 10,
      y: 250,
      id: 5,
    },
    {
      type: 'operation',
      title: 'Service 2',
      x: 140,
      y: 250,
      id: 6,
    },
    {
      x: 270,
      y: 250,
      id: 7,
      title: 'Service 3',
      type: 'operation',
    },
    {
      x: 400,
      y: 250,
      id: 8,
      title: 'Service 4',
      type: 'operation',
    },
  ]);
  const [conns, setConns] = useState([
    {
      source: {
        id: 1,
        position: 'bottom',
      },
      destination: {
        id: 4,
        position: 'top',
      },
      type: 'success',
    },
    {
      source: {
        id: 2,
        position: 'bottom',
      },
      destination: {
        id: 4,
        position: 'top',
      },
      type: 'success',
    },
    {
      source: {
        id: 3,
        position: 'bottom',
      },
      destination: {
        id: 4,
        position: 'top',
      },
      type: 'success',
    },
    {
      source: {
        id: 4,
        position: 'bottom',
      },
      destination: {
        id: 5,
        position: 'top',
      },
      type: 'success',
    },
    {
      source: {
        id: 4,
        position: 'bottom',
      },
      destination: {
        id: 6,
        position: 'top',
      },
      type: 'success',
    },
    {
      source: {
        id: 4,
        position: 'bottom',
      },
      destination: {
        id: 7,
        position: 'top',
      },
      type: 'success',
    },
    {
      source: {
        id: 4,
        position: 'bottom',
      },
      destination: {
        id: 8,
        position: 'top',
      },
      type: 'success',
    },
  ]);

  return (
    <Flowchart
      showToolbar={false}
      onChange={(nodes, connections) => {
        setNodes(nodes);
        setConns(connections);
      }}
      style={{
        width: '100%',
        height: 350,
      }}
      nodes={nodes}
      connections={conns}
    />
  );
};

export default FlowChartComponent;
