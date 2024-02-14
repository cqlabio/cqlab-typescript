import {
  IFlowDefinition,
  IFlowImplementation,
  IFlowDefinitionNode,
  // NodeTypeEnum,
  DefinitionNodeTypeEnum,
  isNextNode,
  IFlowDefinitionNextNode,
  isBooleanNode,
  IFlowDefinitionBooleanNode,
} from '@cqlab/cqflow-core';
import { alphabet } from '@cqlab/ui-flow-diagram';
import compact from 'lodash/compact';

export interface IValidationNodeDefinition {
  type: 'definition-node-error';
  node: IFlowDefinitionNode;
  messages: string[];
}

// export interface IValidationFlow {
//   type: 'flow-error';
//   isValid: boolean;
//   message?: string;
// }

export type IValidationFlowDefinition = IValidationNodeDefinition;

const nodeTypesRequringBinding: Record<string, boolean> = {
  [DefinitionNodeTypeEnum.Action]: true,
  [DefinitionNodeTypeEnum.TrueFalse]: true,
  [DefinitionNodeTypeEnum.EmitData]: true,
  [DefinitionNodeTypeEnum.FormField]: true,
};

export function validateFlowDefinition(
  flowDefinition: IFlowDefinition | null
): IValidationFlowDefinition[] {
  const results: IValidationFlowDefinition[] = [];

  if (!flowDefinition) {
    return [];
  }

  Object.keys(flowDefinition.nodes).forEach((flowNodeId) => {
    const node = flowDefinition.nodes[flowNodeId];

    const result = validateDefinitionForNode(node, flowDefinition);

    if (result) {
      results.push(result);
    }
  });

  return results;
}

export function validateDefinitionForNode(
  node: IFlowDefinitionNode,
  flowDefinition: IFlowDefinition
): IValidationNodeDefinition | null {
  const messages = [];

  if (isNextNode(node)) {
    const nextNode = node as IFlowDefinitionNextNode;
    if (!nextNode.next?.id) {
      messages.push(`Link to next node is missing`);
    } else if (!flowDefinition.nodes[nextNode.next.id]) {
      messages.push(`Unable to resolve link to next node: ${nextNode.next.id}`);
    }
  } else if (isBooleanNode(node)) {
    const boolNode = node as IFlowDefinitionBooleanNode;
    if (!boolNode.next?.trueId) {
      messages.push(`Link to true node is missing`);
    } else if (!flowDefinition.nodes[boolNode.next.trueId]) {
      messages.push(
        `Unable to resolve link to true node: ${boolNode.next.trueId}}`
      );
    } else if (!boolNode.next?.falseId) {
      messages.push(`Link to false node is missing`);
    } else if (!flowDefinition.nodes[boolNode.next.falseId]) {
      messages.push(
        `Unable to resolve link to false node: ${boolNode.next.falseId}}`
      );
    }
  } else if (node.nodeType === DefinitionNodeTypeEnum.Branch) {
    node.next?.options.forEach((option, index) => {
      if (!option.toId) {
        messages.push(
          `Option "${alphabet[index]}" is missing link to next node`
        );
      } else if (!flowDefinition.nodes[option.toId]) {
        messages.push(
          `Option "${alphabet[index]}" unable to resolve link to next node: ${option.toId}`
        );
      }
    });
  }

  if (messages.length === 0) {
    return null;
  }

  return {
    type: 'definition-node-error',
    node,
    messages: messages,
  };
}

// export function validateDefinitionForNode(
//   flowDefinition: IFlowDefinition,
//   flowNodeId: string
// ): IValidationResult {
//   const flowDefNode = flowDefinition?.nodes[flowNodeId];

// const requiresBinding = !!nodeTypesRequringBinding[flowDefNode.nodeType];

// const implementationNode =
//   flowImplementation && flowDefNode.bindId
//     ? flowImplementation.nodeBindings[flowDefNode.bindId]
//     : null;

// if (requiresBinding && !implementationNode) {
//   return {
//     type: 'node-error',
//     node: flowDefNode,
//     isValid: false,
//     message: `Missing implementation for node`,
//   };
// } else {
//   return {
//     type: 'node-error',
//     node: flowDefNode,
//     isValid: true,
//   };
// }
// }
