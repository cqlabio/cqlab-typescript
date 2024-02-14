import Box from '@mui/material/Box';
import { INarrativeNode } from '@cqlab/cqflow-core';
import { DocumentPanel } from './common/document-panel';

type NarrativeDocumentPanel = {
  node: INarrativeNode;
  panelNumber: number;
};

export function NarrativeDocumentPanel({
  node,
  panelNumber,
}: NarrativeDocumentPanel) {
  return (
    <DocumentPanel node={node} panelNumber={panelNumber}>
      {node.label}
    </DocumentPanel>
  );
}
