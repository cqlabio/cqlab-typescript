import Box from '@mui/material/Box';
import { IEmitDataNode } from '@cqlab/cqflow-core';
import { DocumentPanel } from './common/document-panel';

type EmitDataDocumentPanel = {
  node: IEmitDataNode;
  panelNumber: number;
};

export function EmitDataDocumentPanel({
  node,
  panelNumber,
}: EmitDataDocumentPanel) {
  return (
    <DocumentPanel node={node} panelNumber={panelNumber}>
      {node.label}
    </DocumentPanel>
  );
}
