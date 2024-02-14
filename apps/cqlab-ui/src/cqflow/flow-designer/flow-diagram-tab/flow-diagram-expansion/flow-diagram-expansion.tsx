import { useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import 'reactflow/dist/style.css';
// import { convertNodesAndEdges } from '../../../../../../libs/cqflow-react-components/src/flow-diagram/convert-nodes-and-edges';
import {
  flowDiagramNodeTypes,
  convertNodesAndEdges,
  NODE_DEFAULT_WIDTH,
} from '@cqlab/ui-flow-diagram';

import { FlowDesignerContext } from '../../flow-designer-context';
import {
  measureDiagramNodes,
  getLayoutedElements,
} from '../utils/measure-diagram-nodes';
import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Background,
} from 'reactflow';
// import { nodeTypes } from '../flow-diagram/flow-diagram';
// import { expandNodes } from '@cqlab/cqflow-core';

export function FlowDiagramExpansion() {
  const { flowDefinition } = useContext(FlowDesignerContext);
  // const flowDefinition = useFlowStore((state) => state.flowDefinition);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // const expandedNodes = expandNodes(flowDefinition.nodes);
    const expandedNodes = flowDefinition.nodes;

    measureDiagramNodes(expandedNodes, (nextNodes) => {
      // console.log(nextGraphnextNodesData);

      const { nodes: reactflowNodes, edges: reactflowEdges } =
        convertNodesAndEdges(nextNodes, false, null, null, null);

      // const { nodes: finalNodes, edges: finalEdges } = getLayoutedElements(
      //   reactflowNodes,
      //   reactflowEdges
      // );

      // setNodes([...finalNodes]);
      // setEdges([...finalEdges]);
    });
  }, [flowDefinition, setNodes, setEdges]);

  return (
    <Box sx={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={flowDiagramNodeTypes}
        fitView
      >
        <Background
          color="rgb(240,240,240)"
          gap={32}
          variant={BackgroundVariant.Lines}
        />
      </ReactFlow>
    </Box>
  );
}
