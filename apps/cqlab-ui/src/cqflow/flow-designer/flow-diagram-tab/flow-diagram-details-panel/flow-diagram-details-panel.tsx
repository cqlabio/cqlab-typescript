import { ReactNode, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {
  IFlowDefinition,
  IFlowDefinitionNode,
  DefinitionNodeTypeEnum,
} from '@cqlab/cqflow-core';
import { RootFlowPanel } from './root-flow-panel/root-flow-panel';
import { StartPanel } from './flow-node-panels/start-node-panel';
import { EndPanel } from './flow-node-panels/end-node-panel';
import { TrueFalsePanel } from './flow-node-panels/truefalse-node-panel';
import { EmitDataPanel } from './flow-node-panels/emitdata-node-panel';
import { ActionPanel } from './flow-node-panels/action-panel/action-node-panel';
import { LogicTreePanel } from './flow-node-panels/logic-tree-panel/logictree-node-panel';
import { SubFlowPanel } from './flow-node-panels/subflow-panel';
import { CustomFormPanel } from './flow-node-panels/inputdata-node-panel';
import { BranchChoiceDataPanel } from './flow-node-panels/branchchoice-panel/branchchoice-panel';
import { NarrativeNodePanel } from './flow-node-panels/narrative-node-panel';
import { MultiOptionPanel } from './flow-node-panels/multi-option-panel/multi-option-panel';
import { NoteNodePanel } from './flow-node-panels/note-panel';
import { FormFieldPanel } from './flow-node-panels/form-field-panel/form-field-panel';

// import { MessagePanel } from './flow-node-panels/message-node-panel';
import { FlowDesignerContext } from '../../flow-designer-context';
import { useFlowStore } from '../../../flow-store';
import { shallow } from 'zustand/shallow';

export function FlowDiagramDetailsPanel() {
  const { flowDefinition } = useContext(FlowDesignerContext);

  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);

  const selectedNode = selectedNodeId
    ? flowDefinition.nodes[selectedNodeId]
    : null;

  let content: ReactNode = null;

  if (selectedNode) {
    if (selectedNode.nodeType === DefinitionNodeTypeEnum.Start) {
      content = <StartPanel node={selectedNode} />;
      // } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.YesNo) {
      //   content = <YesNoPanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.Note) {
      content = <NoteNodePanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
      content = <TrueFalsePanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.MultiOption) {
      content = <MultiOptionPanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.EmitData) {
      content = <EmitDataPanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.CustomForm) {
      content = <CustomFormPanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.Action) {
      content = <ActionPanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.Branch) {
      content = <BranchChoiceDataPanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.LogicTree) {
      content = <LogicTreePanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.Narrative) {
      content = <NarrativeNodePanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.SubFlow) {
      content = <SubFlowPanel node={selectedNode} />;
      // } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.Message) {
      //   content = <MessagePanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.End) {
      content = <EndPanel node={selectedNode} />;
    } else if (selectedNode.nodeType === DefinitionNodeTypeEnum.FormField) {
      content = <FormFieldPanel node={selectedNode} />;
    } else {
      content = (
        <Box sx={{ padding: '10px' }}>
          Unknown Node Type: {JSON.stringify(selectedNode, null, 2)}
        </Box>
      );
    }
  } else {
    content = <RootFlowPanel />;
  }

  return (
    <Paper
      square
      sx={{
        borderTop: '1px solid rgb(230,230,230)',
        height: '100%',
        overflowY: 'scroll',
      }}
    >
      {content}
    </Paper>
  );
}
