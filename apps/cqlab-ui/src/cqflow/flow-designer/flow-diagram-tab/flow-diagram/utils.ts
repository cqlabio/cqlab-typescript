import {
  DefinitionNodeTypeEnum,
  IFlowDefinitionBooleanNode,
  IFlowDefinitionNextNode,
  IFlowDefinitionNode,
  ILogicLeaf,
  ILogicTreeNode,
  LogicEnum,
  isBooleanNode,
  isNextNode,
} from '@cqlab/cqflow-core';
import { getCustomNanoId } from './node-templates';
import cloneDeep from 'lodash/cloneDeep';

type CopyPateState = Record<string, IFlowDefinitionNode>;

export function cloneCopyPasteState(
  copyPateState: CopyPateState,
  newPosition: { x: number; y: number }
): CopyPateState {
  const nextNodes: Record<string, IFlowDefinitionNode> = {};

  const nodes = Object.values(copyPateState);

  if (nodes.length === 0) {
    return copyPateState;
  }

  const topMostNode = getTopMostNode(nodes);

  if (!topMostNode.position) {
    return copyPateState;
  }

  const diffX = newPosition.x - topMostNode.position.x;
  const diffY = newPosition.y - topMostNode.position.y;

  const idMappings: Record<string, string> = {};

  nodes.forEach((node) => {
    const clonedNode = cloneDeep(node);
    const newId = getCustomNanoId(node.nodeType);
    idMappings[node.id] = newId;

    if (clonedNode.position) {
      nextNodes[newId] = {
        ...clonedNode,
        id: newId,
        position: {
          ...clonedNode.position,
          x: clonedNode.position.x + diffX,
          y: clonedNode.position.y + diffY,
        },
      };
    }
  });

  // Update all the references
  Object.values(nextNodes).forEach((clonedNode) => {
    if (isNextNode(clonedNode)) {
      const definedNode = clonedNode as IFlowDefinitionNextNode;
      if (definedNode.next?.id) {
        definedNode.next = {
          ...definedNode.next,
          id: idMappings[definedNode.next.id],
        };
      }
    } else if (isBooleanNode(clonedNode)) {
      const boolNode = clonedNode as IFlowDefinitionBooleanNode;

      if (boolNode.next?.trueId) {
        boolNode.next = {
          ...boolNode.next,
          trueId: idMappings[boolNode.next.trueId],
        };
      }

      if (boolNode.next?.falseId) {
        boolNode.next = {
          ...boolNode.next,
          falseId: idMappings[boolNode.next.falseId],
        };
      }

      // Update the logic tree children
      if (boolNode.nodeType === DefinitionNodeTypeEnum.LogicTree) {
        updateLogicTreeChildren(boolNode);
      }
    } else if (clonedNode.nodeType === DefinitionNodeTypeEnum.Branch) {
      if (clonedNode.next?.options) {
        clonedNode.next.options = clonedNode.next?.options.map((option) => {
          if (option.toId) {
            option.toId = idMappings[option.toId] || undefined;
          }
          return option;
        });
      }
    }
  });

  return nextNodes;
}

// Should only be passed a cloned reference
function updateLogicTreeChildren(logicTreeNode: ILogicTreeNode) {
  function recurse(node: ILogicLeaf) {
    if (node.logicType === LogicEnum.TrueFalseLeaf) {
      node.id = getCustomNanoId(DefinitionNodeTypeEnum.TrueFalse);
    } else {
      node.children.forEach((child) => recurse(child));
    }
  }

  if (logicTreeNode.logicTree) {
    recurse(logicTreeNode.logicTree);
  }
}

function getTopMostNode(nodes: IFlowDefinitionNode[]): IFlowDefinitionNode {
  let selectedNode = nodes[0];
  for (let i = 0; i < nodes.length; i++) {
    const currNode = nodes[i];

    if (currNode.position && selectedNode.position) {
      if (currNode.position.y < selectedNode.position.y) {
        selectedNode = currNode;
      } else if (
        currNode.position.y === selectedNode.position.y &&
        currNode.position.x < selectedNode.position.x
      ) {
        selectedNode = currNode;
      }
    }
  }

  return selectedNode;
}
