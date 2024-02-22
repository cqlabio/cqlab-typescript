import Box from '@mui/material/Box';
// import { IBooleanNode } from '@cqlabio/shared/types';
// import FlowDocumentPanel from '../../FlowDocumentPanel';
import { ILogic } from '@cqlab/cqflow-core';

type LabelNodeProps = {
  node: ILogic;
  prevLabel: string;
};

export function BooleanNode({ node, prevLabel }: LabelNodeProps) {
  const { children } = node;

  const label = node.logicType;

  const childrenView = children.map((child, index) => {
    if (child.logicType === 'And' || child.logicType === 'Or') {
      return (
        <Box sx={{}}>
          <BooleanNode node={child} prevLabel={label} />
        </Box>
      );
    }

    let labelText = label === 'And' ? 'AND' : 'OR';

    if (index === children.length - 1) {
      labelText = prevLabel;
    }

    return (
      <li key={index}>
        <Box component="span">{child.label}</Box>
        <strong
          style={{
            fontSize: '14px',
            paddingLeft: '3px',
            textTransform: 'uppercase',
          }}
        >
          {labelText}
        </strong>
      </li>
    );
  });

  return (
    <Box component="ul" sx={{ paddingLeft: '20px', marginTop: 0 }}>
      {childrenView}
    </Box>
  );
}

type LogicNodeProps = {
  logicTree?: ILogic;
};

export function DocumentLogicTree({ logicTree }: LogicNodeProps) {
  if (!logicTree) {
    return <Box>Logic not found</Box>;
  }
  return <BooleanNode node={logicTree} prevLabel={''} />;
}
