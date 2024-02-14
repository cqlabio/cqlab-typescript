import { IFlowDefinition, IFlowDefinitionNode } from '@cqlab/cqflow-core';
import { cloneDeep } from 'lodash';

interface UpdateOp {
  op: 'update';
  node: IFlowDefinitionNode;
}

interface DeleteOp {
  op: 'delete';
  nodeId: string;
}

export type NodeOp = UpdateOp | DeleteOp;

export type DoNodeUpdates = (ops: NodeOp | NodeOp[]) => void;

export function applyOpsToFlowDefinition(
  flowDefinition: IFlowDefinition,
  ops: NodeOp | NodeOp[]
) {
  const nextFlowDefinition = cloneDeep(flowDefinition);

  if (!Array.isArray(ops)) {
    ops = [ops];
  }

  for (const op of ops) {
    if (op.op === 'update') {
      nextFlowDefinition.nodes[op.node.id] = op.node;
    } else if (op.op === 'delete') {
      delete nextFlowDefinition.nodes[op.nodeId];
    }
  }

  return nextFlowDefinition;
}
