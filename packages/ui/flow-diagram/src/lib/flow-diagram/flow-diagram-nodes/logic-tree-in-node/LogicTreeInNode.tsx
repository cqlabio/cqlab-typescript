import Box from '@mui/material/Box';
import LogicNodeStyleWrapper from './LogicNodeStyleWrapper';
import {
  ILogic,
  LogicEnum,
  ITrueFalseLeaf,
  ILogicLeaf,
  // ILogicTreeItem,
  // ILogicReference,
} from '@cqlab/cqflow-core';

type ConstraintNodeProps = {
  node: ITrueFalseLeaf;
};

function ConstraintNode({ node }: ConstraintNodeProps) {
  return (
    <Box sx={{ display: 'flex', fontWeight: 300 }}>
      <Box sx={{ flexGrow: 1 }}>{node.label}</Box>
    </Box>
  );
}

type BooleanNodeProps = {
  node: ILogic; // IBaseBooleanNode;
};

export function BooleanNode({ node }: BooleanNodeProps) {
  const { children } = node;

  const childNodes = children.map((c: any, i: number) => {
    return (
      <li key={i}>
        <LogicNode node={c} />
      </li>
    );
  });

  return (
    <Box sx={{ fontSize: '15px' }}>
      <Box>
        <strong style={{ textTransform: 'uppercase' }}>{node.logicType}</strong>
      </Box>
      <LogicNodeStyleWrapper>{childNodes}</LogicNodeStyleWrapper>
    </Box>
  );
}

type LogicNodeProps = {
  node: ILogicLeaf | null; // ILogicNode;
};

export default function LogicNode({ node }: LogicNodeProps) {
  if (!node) {
    return <div>No Query</div>;
  }

  if (node.logicType === LogicEnum.And || node.logicType === LogicEnum.Or) {
    return <BooleanNode node={node} />;
  }

  return <ConstraintNode node={node} />;
}
