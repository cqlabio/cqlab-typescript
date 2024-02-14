import Box from '@mui/material/Box';
import { ITrueFalseNode } from '@cqlab/cqflow-core';
import { DocumentPanel } from './common/document-panel';

type TrueFalseDocumentPanel = {
  node: ITrueFalseNode;
  panelNumber: number;
};

export function TrueFalseDocumentPanel({
  node,
  panelNumber,
}: TrueFalseDocumentPanel) {
  return (
    <DocumentPanel node={node} panelNumber={panelNumber}>
      {node.label}
    </DocumentPanel>
  );
}
