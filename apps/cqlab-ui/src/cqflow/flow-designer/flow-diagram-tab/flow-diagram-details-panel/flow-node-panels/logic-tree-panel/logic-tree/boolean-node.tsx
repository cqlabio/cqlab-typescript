import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import { LogicNodeStyled } from './logic-node-styled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
// import { IBaseBooleanNode, ILogicNode } from '@cqlabio/shared/types';
import { LogicNode } from './logic-node';
import { v4 as uuidv4 } from 'uuid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  ILogic,
  LogicEnum,
  ILogicLeaf,
  // NodeTypeEnum,
  DefinitionNodeTypeEnum,
  IFlowDefinitionNode,
  ITrueFalseLeaf,
  ITrueFalseNode,
} from '@cqlab/cqflow-core';
// import { FlowContext } from '../../../flow-context';
import { newNodeTemplates } from '../../../../flow-diagram/node-templates';
import { NodeOp } from '../../../../../../flow-store';

// function getChildIds(node: ILogic): string[] {
//   const childIds: string[] = [];
//   if (node.logicType === LogicEnum.And || node.logicType === LogicEnum.Or) {
//     for (const c of node.children) {
//       if (c.logicType === LogicEnum.Reference) {
//         if (c.referenceId) {
//           childIds.push(c.referenceId);
//         }
//       } else {
//         childIds.push(...getChildIds(c));
//       }
//     }
//   }

//   return childIds;
// }

export type UpdateLogicTreeNode = (
  nextLogic: ILogicLeaf | null,
  extraOps: NodeOp[] | null
) => void;

type BooleanNodeProps = {
  node: ILogic;
  updateLogicTreeNode: UpdateLogicTreeNode;
  isRoot?: boolean;
  onSelectConstraint: (constraintId: string) => void;
};

export function BooleanNodeEdit({
  node,
  updateLogicTreeNode,
  isRoot,
  onSelectConstraint,
}: BooleanNodeProps) {
  // const { updateFlowNode }  = useContext(FlowContext);

  const [newNodeAnchorEl, setNewNodeAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [currentAnchorEl, setCurrentAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleCloseNewAnchorEl = () => setNewNodeAnchorEl(null);
  const handleCloseCurrentAnchorEl = () => setCurrentAnchorEl(null);

  const handleOpenNewAnchorEl = (event: React.MouseEvent<HTMLElement>) => {
    setNewNodeAnchorEl(event.currentTarget);
  };

  const handleOpenCurrentAnchorEl = (event: React.MouseEvent<HTMLElement>) => {
    setCurrentAnchorEl(event.currentTarget);
  };

  const onChangeNodeType = (logicType: LogicEnum.Or | LogicEnum.And) => {
    updateLogicTreeNode(
      {
        ...node,
        logicType: logicType,
      },
      null
    );

    setCurrentAnchorEl(null);
  };

  const onAddLogicNode = (logicType: LogicEnum.And | LogicEnum.Or) => {
    const nextChildren = cloneDeep(node.children);

    if (logicType === LogicEnum.And) {
      nextChildren.push({
        logicType: LogicEnum.And,
        children: [],
      });
    } else if (logicType === LogicEnum.Or) {
      nextChildren.push({
        logicType: LogicEnum.Or,
        children: [],
      });
    }

    updateLogicTreeNode(
      {
        ...node,
        children: nextChildren,
      },
      null
    );

    handleCloseNewAnchorEl();
  };

  const onAddTrueFalseLeaf = () => {
    const nextChildren = cloneDeep(node.children);

    const template = newNodeTemplates[
      DefinitionNodeTypeEnum.TrueFalse
    ]() as ITrueFalseNode;

    // Remove next and position from TrueFalseNode
    const { next, position, ...rest } = template;

    const trueFalseLeaf: ITrueFalseLeaf = {
      logicType: LogicEnum.TrueFalseLeaf,
      ...rest,
    };

    nextChildren.push(trueFalseLeaf);

    updateLogicTreeNode(
      {
        ...node,
        children: nextChildren,
      },
      null
    );

    handleCloseNewAnchorEl();
  };

  const onUpdateChildNode = (
    childIndex: number,
    childNode: ILogicLeaf | null,
    extraOps: NodeOp[] | null
  ) => {
    const nextChildren = cloneDeep(node.children);
    // @ts-expect-error compact will clean
    nextChildren[childIndex] = childNode;

    updateLogicTreeNode(
      {
        ...node,
        children: compact(nextChildren),
      },
      extraOps
    );
  };

  const onDelete = () => {
    updateLogicTreeNode(null, null);
  };

  return (
    <Box sx={{ fontSize: '15px' }}>
      <Box sx={{ display: 'flex', padding: '3px 0 5px 2px' }}>
        <Box
          style={{ textTransform: 'uppercase', cursor: 'pointer' }}
          onClick={handleOpenCurrentAnchorEl}
        >
          {node.logicType}
        </Box>
        <Box
          onClick={onDelete}
          style={{
            paddingRight: '10px',
          }}
        >
          {!isRoot && (
            <DeleteOutlineIcon
              sx={{
                fontSize: '13px',
                color: '#EF5350',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
            />
          )}
        </Box>
      </Box>
      <LogicNodeStyled>
        {node.children.map((child, i) => (
          <li key={i}>
            <LogicNode
              node={child}
              updateLogicTreeNode={(nextNode, constraint) =>
                onUpdateChildNode(i, nextNode, constraint)
              }
              onSelectConstraint={onSelectConstraint}
            />
          </li>
        ))}
        <Box
          component="li"
          onClick={handleOpenNewAnchorEl}
          sx={{
            fontSize: '14px',
            // fontWeight: 'bold',
            cursor: 'pointer',
            paddingTop: '5px',
          }}
        >
          + ADD
        </Box>
      </LogicNodeStyled>
      <Menu
        anchorEl={currentAnchorEl}
        open={!!currentAnchorEl}
        onClose={handleCloseCurrentAnchorEl}
      >
        <MenuItem
          sx={{ fontSize: '14px' }}
          onClick={() => onChangeNodeType(LogicEnum.And)}
        >
          <strong style={{ marginRight: '4px' }}>AND</strong>
        </MenuItem>
        <MenuItem
          sx={{ fontSize: '14px' }}
          onClick={() => onChangeNodeType(LogicEnum.Or)}
        >
          <strong style={{ marginRight: '4px' }}>OR</strong>
        </MenuItem>
        <Divider />
        {/* <MenuItem sx={{ fontSize: '14px' }} onClick={() => onAddNode('or')}>
          <strong style={{ marginRight: '4px' }}>NOT AND</strong>
        </MenuItem>
        <MenuItem sx={{ fontSize: '14px' }} onClick={() => onAddNode('or')}>
          <strong style={{ marginRight: '4px' }}>NOT OR</strong>
        </MenuItem> */}
      </Menu>

      <Menu
        anchorEl={newNodeAnchorEl}
        open={!!newNodeAnchorEl}
        onClose={handleCloseNewAnchorEl}
      >
        <MenuItem
          sx={{ fontSize: '14px' }}
          onClick={() => onAddLogicNode(LogicEnum.And)}
        >
          <strong style={{ marginRight: '4px' }}>And</strong>
        </MenuItem>
        <MenuItem
          sx={{ fontSize: '14px' }}
          onClick={() => onAddLogicNode(LogicEnum.Or)}
        >
          <strong style={{ marginRight: '4px' }}>Or</strong>
        </MenuItem>
        <Divider />
        {/* <MenuItem
          sx={{ fontSize: '14px' }}
          onClick={() => onAddTrueFalseLeaf(NodeTypeEnum.Exec)}
        >
          <strong style={{ marginRight: '4px' }}>Evaluate Node</strong>
        </MenuItem> */}

        <MenuItem sx={{ fontSize: '14px' }} onClick={onAddTrueFalseLeaf}>
          <strong style={{ marginRight: '4px' }}>TrueFalse</strong>
        </MenuItem>
      </Menu>
    </Box>
  );
}
