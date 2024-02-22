import { ReactNode, useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { FlowDesignerContext } from '../../flow-designer-context';
import { DefinitionNodeTypeEnum } from '@cqlab/cqflow-core';
import { createPanelsFromFlowDefinition } from './utils-panels-from-graph';
import { TrueFalseDocumentPanel } from './document-panels/truefalse-document-panel';
import { EmitDataDocumentPanel } from './document-panels/emitdata-document-panel';
import { LogicTreeDocumentPanel } from './document-panels/logictree-document-panel';
import { NarrativeDocumentPanel } from './document-panels/narrative-document-panel';

export function FlowDiagramDocument() {
  const { flowDefinition } = useContext(FlowDesignerContext);

  const panelNodes = createPanelsFromFlowDefinition(
    Object.values(flowDefinition.nodes || {})
  );

  const panels = panelNodes.map((node, index) => {
    const panelNumber = index + 1;

    if (node.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
      return <TrueFalseDocumentPanel node={node} panelNumber={panelNumber} />;
    }
    if (node.nodeType === DefinitionNodeTypeEnum.EmitData) {
      return <EmitDataDocumentPanel node={node} panelNumber={panelNumber} />;
    }
    if (node.nodeType === DefinitionNodeTypeEnum.LogicTree) {
      return <LogicTreeDocumentPanel node={node} panelNumber={panelNumber} />;
    }

    if (node.nodeType === DefinitionNodeTypeEnum.Narrative) {
      return <NarrativeDocumentPanel node={node} panelNumber={panelNumber} />;
    }

    return (
      <Box>
        Not Complete [{node.nodeType}]: {node.label}
      </Box>
    );
  });

  return <Paper sx={{ margin: '20px' }}>{panels}</Paper>;
}
