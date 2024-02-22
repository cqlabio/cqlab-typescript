import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Controls,
  useViewport,
  ReactFlowProvider,
} from 'reactflow';

import { flowDiagramNodeTypes, flowDiagramEdgesTypes } from './node-types';
import { LocalFlowNode, convertNodesAndEdges } from './convert-nodes-and-edges';
import { IFlowDefinition } from '@cqlab/cqflow-core';
import Box from '@mui/material/Box';
import 'reactflow/dist/style.css';

type DisplayFlowDiagramProps = {
  flowDefinition: IFlowDefinition;
  zoomOnScroll?: boolean;
};

export function DisplayFlowDiagram({
  flowDefinition,
  zoomOnScroll = true,
}: DisplayFlowDiagramProps) {
  const { zoom } = useViewport();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!flowDefinition) {
      return;
    }

    const { nodes: reactflowNodes, edges: reactflowEdges } =
      convertNodesAndEdges(
        flowDefinition.nodes,
        false,
        selectedNodeId,
        null,
        null
      );

    console.log(reactflowNodes);

    setNodes([...reactflowNodes]);
    setEdges([...reactflowEdges]);
  }, [flowDefinition, setEdges, setNodes, selectedNodeId]);

  const onNodeClick = useCallback(
    (event: any, node: LocalFlowNode) => {
      setSelectedNodeId(node.data.node.id || null);
    },
    [setSelectedNodeId]
  );

  let backgroundGap = 30;
  if (zoom < 0.4) {
    backgroundGap = 60;
  }
  if (zoom <= 0.2) {
    backgroundGap = 120;
  }

  return (
    <Box sx={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={flowDiagramNodeTypes}
        edgeTypes={flowDiagramEdgesTypes}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        zoomOnScroll={zoomOnScroll}
        maxZoom={2}
        minZoom={0.1}
      >
        <Background
          id="1"
          gap={backgroundGap}
          // color="rgba(227,242,253, 0.5)"
          color="rgb(245,245,245)"
          variant={BackgroundVariant.Lines}
        />
        <Background
          id="2"
          gap={backgroundGap * 5}
          color="rgb(240,240,240)"
          // color="#E1F5FE"
          variant={BackgroundVariant.Lines}
        />
        <Controls />
      </ReactFlow>
    </Box>
  );
}
