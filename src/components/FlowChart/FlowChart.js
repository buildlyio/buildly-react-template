import React, { useEffect, useState } from 'react';

import Flowchart from 'flowchart-react';

const FlowChartComponent = ({ componentsData }) => {
  const [nodes, setNodes] = useState(componentsData?.components || []);
  const [conns, setConns] = useState(componentsData?.path_def || []);

  useEffect(() => {
    if (componentsData) {
      setNodes(componentsData.components);
      setConns(componentsData.path_def);
    }
  }, [componentsData]);

  return (
    <Flowchart
      showToolbar={false}
      // onChange={(treeNodes, connections) => {
      //   setNodes(treeNodes);
      //   setConns(connections);
      // }}
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
