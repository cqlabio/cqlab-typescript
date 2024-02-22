import Box from '@mui/material/Box';
import { ILogicTreeNode } from '@cqlab/cqflow-core';
import { DocumentPanel } from './common/document-panel';
import { DocumentLogicTree } from './logictree-tree';

type LogicTreeDocumentPanel = {
  node: ILogicTreeNode;
  panelNumber: number;
};

export function LogicTreeDocumentPanel({
  node,
  panelNumber,
}: LogicTreeDocumentPanel) {
  return (
    <DocumentPanel node={node} panelNumber={panelNumber}>
      <DocumentLogicTree logicTree={node.logicTree} />
    </DocumentPanel>
  );
}
