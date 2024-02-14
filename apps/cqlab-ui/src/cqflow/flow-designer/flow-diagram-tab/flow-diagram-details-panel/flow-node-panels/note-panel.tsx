import { INarrativeNode, INoteNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../common/node-type-with-delete';
import { PanelLabel } from '../common/panel-label';
import { PanelNodeLabel } from '../common/panel-node-label';
import { PanelNodeId } from '../common/panel-node-id';
import { PanelWrapper } from '../common/panel-wrapper';
import { LinkNextSection } from '../common/link-next-section';
import { EditableTextRow } from '../common/editable-text-row';
import { useContext } from 'react';
import { FlowDesignerContext } from '../../../flow-designer-context';

type NotePanelProps = {
  node: INoteNode;
};

export function NoteNodePanel({ node }: NotePanelProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const onUpdateContents = (nextNote: string) => {
    doNodeUpdates({
      op: 'update',
      node: {
        ...node,
        contents: nextNote,
      },
    });
  };

  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Note" nodeId={node.id} />

      <PanelNodeId node={node} />

      {/* <PanelNodeLabel node={node} /> */}
      <PanelLabel label="Note" />

      <EditableTextRow
        value={node.contents || ''}
        onSaveValue={onUpdateContents}
        isMultiLine
      />
    </PanelWrapper>
  );
}
