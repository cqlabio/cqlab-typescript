import { useEffect, useContext } from 'react';
import { shallow } from 'zustand/shallow';
import Box from '@mui/material/Box';
import 'reactflow/dist/style.css';

import {
  convertNodesAndEdges,
  flowDiagramNodeTypes,
  flowDiagramEdgesTypes,
} from '@cqlab/ui-flow-diagram';

import { useFlowStore } from '../../flow-store';

import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Node,
  BackgroundVariant,
  Background,
  ConnectionMode,
} from 'reactflow';

import { FlowDesignerContext } from '../flow-designer-context';

export function FlowImplemtationDiagram() {
  const { selectedNodeId } = useFlowStore(
    (state) => ({
      // flowDefinition: state.flowDefinition,
      // doNodeUpdates: state.doNodeUpdates,
      setSelectedNodeId: state.setSelectedNodeId,
      // setSecondSelectedNodeId: state.setSecondSelectedNodeId,
      selectedNodeId: state.selectedNodeId,
    }),
    shallow
  );

  const { flowDefinition, validationResults } = useContext(FlowDesignerContext);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // console.log('berere', edges);
  // console.log('berere2', nodes)

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
        validationResults
      );

    setNodes([...reactflowNodes]);
    setEdges([...reactflowEdges]);
  }, [flowDefinition, setEdges, setNodes, selectedNodeId, validationResults]);

  const onNodeClick = (event: any, node: Node) => {
    // console.log(node)
    // setSelectedNodeId(node.data.id || null);
    // const { selectNodeById } = actionManager(
    //   decisionFlowVersion.decisionFlow.id
    // );
    // dispatch(selectNodeById({ nodeId: node.id }));
  };

  const onPaneClick = () => {
    // setSelectedNodeId(null);
    // setSecondSelectedNodeId(null);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={flowDiagramNodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        connectionMode={ConnectionMode.Loose}
        edgeTypes={flowDiagramEdgesTypes}
        fitView
      >
        <Background
          color="rgb(225,225,225)"
          gap={32}
          size={3}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </Box>
  );
}
