import { ITrueFalseLeaf, ILogicLeaf, LogicEnum } from '@cqlab/cqflow-core';

export function findLeafNodeInLogicTree(
  leafNode: ILogicLeaf | undefined,
  leafId: string | null
): ITrueFalseLeaf | null {
  if (!leafNode || !leafId) {
    return null;
  }

  if (
    leafNode.logicType === LogicEnum.And ||
    leafNode.logicType === LogicEnum.Or
  ) {
    for (const child of leafNode.children) {
      const result = findLeafNodeInLogicTree(child, leafId);
      if (result) {
        return result;
      }
    }
  } else if (leafNode.logicType === LogicEnum.TrueFalseLeaf) {
    if (leafNode.id === leafId) {
      return leafNode;
    }
  } else {
    throw new Error(`Unexpected logic node type`);
  }

  return null;
}

export function updateLeafNodeInLogicTree(
  leafNode: ILogicLeaf,
  newLeafNode: ITrueFalseLeaf
): ILogicLeaf {
  if (
    leafNode.logicType === LogicEnum.And ||
    leafNode.logicType === LogicEnum.Or
  ) {
    return {
      ...leafNode,
      children: leafNode.children.map((child) =>
        updateLeafNodeInLogicTree(child, newLeafNode)
      ),
    };
  } else if (leafNode.logicType === LogicEnum.TrueFalseLeaf) {
    if (leafNode.id === newLeafNode.id) {
      return { ...newLeafNode };
    } else {
      return { ...leafNode };
    }
  } else {
    throw new Error(`Unexpected logic node type`);
  }
}
