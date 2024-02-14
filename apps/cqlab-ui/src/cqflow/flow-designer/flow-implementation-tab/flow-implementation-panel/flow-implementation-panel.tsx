import { ReactNode, useContext } from 'react';
import Paper from '@mui/material/Paper';
// import { RootFlowPanel } from './root-flow-panel/root-flow-panel';
// import { StartPanel } from './flow-node-panels/start-node-panel';
// import { YesNoPanel } from './flow-node-panels/yesno-node-panel';
// import { TrueFalsePanel } from './flow-node-panels/truefalse-node-panel';
// import { EmitDataPanel } from './flow-node-panels/contextdata-node-panel';
// import { ActionPanel } from './flow-node-panels/action-node-panel';
// import { LogicTreePanel } from './flow-node-panels/logic-tree-panel/logictree-node-panel';
// import { SubFlowPanel } from './flow-node-panels/subflow-panel';
// import { BranchChoiceDataPanel } from './flow-node-panels/branchchoice-panel/branchchoice-panel';
// import { MessagePanel } from './flow-node-panels/message-node-panel';
import { FlowDesignerContext } from '../../flow-designer-context';
import { useFlowStore } from '../../../flow-store';
import { RootImplementationPanel } from './root-implemntation-panel';

export function FlowImplementationPanel() {
  const { flowDefinition } = useContext(FlowDesignerContext);

  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);

  const selectedNode = selectedNodeId
    ? flowDefinition.nodes[selectedNodeId]
    : null;

  let content: ReactNode = null;

  // if (selectedNode) {
  //   if (selectedNode.nodeType === DefinitionNodeTypeEnum.Start) {
  //     content = <StartPanel node={selectedNode} />;
  //     // } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.YesNo) {
  //     //   content = <YesNoPanel node={selectedNode} />;
  //   } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
  //     content = <TrueFalsePanel node={selectedNode} />;
  //   } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.EmitData) {
  //     content = <EmitDataPanel node={selectedNode} />;
  //   } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.Action) {
  //     content = <ActionPanel node={selectedNode} />;
  //   } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.Branch) {
  //     content = <BranchChoiceDataPanel node={selectedNode} />;
  //   } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.LogicTree) {
  //     content = <LogicTreePanel node={selectedNode} />;
  //   } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.SubFlow) {
  //     content = <SubFlowPanel node={selectedNode} />;
  //     // } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.Message) {
  //     //   content = <MessagePanel node={selectedNode} />;
  //   } else {
  //     content = (
  //       <Box sx={{ padding: '10px' }}>
  //         Unknown Node Type: {selectedNode.nodeType}
  //       </Box>
  //     );
  //   }
  // } else {
  content = <RootImplementationPanel />;
  // }

  return (
    <Paper
      square
      sx={{ borderTop: '1px solid rgb(230,230,230)', height: '100%' }}
    >
      {content}
    </Paper>
  );
}
