import { ILogicLeaf, LogicEnum } from '@cqlab/cqflow-core';
import { TrueFalseLeafView } from './truefalse-leaf-node';

import { BooleanNodeEdit, UpdateLogicTreeNode } from './boolean-node';
// import ConstraintNodeEdit from './ConstraintNodeEdit';
import Box from '@mui/material/Box';

type LogicNodeProps = {
  node: ILogicLeaf;
  updateLogicTreeNode: UpdateLogicTreeNode;
  onSelectConstraint: (constraintId: string) => void;
};

export function LogicNode({
  node,
  updateLogicTreeNode,
  onSelectConstraint,
}: LogicNodeProps) {
  if (!node) {
    return <div>Node not found</div>;
  }

  if (node.logicType === LogicEnum.TrueFalseLeaf) {
    return (
      <TrueFalseLeafView
        leafNode={node}
        updateLogicTreeNode={updateLogicTreeNode}
      />
    );
  }

  if (node.logicType === LogicEnum.And || node.logicType === LogicEnum.Or) {
    return (
      <BooleanNodeEdit
        node={node}
        updateLogicTreeNode={updateLogicTreeNode}
        onSelectConstraint={onSelectConstraint}
      />
    );
  }

  return (
    <Box>NEED TO DO: NOT</Box>
    // <ConstraintNodeEdit
    //   node={node}
    //   updateNode={updateNode}
    //   onSelectConstraint={onSelectConstraint}
    // />
  );
}
