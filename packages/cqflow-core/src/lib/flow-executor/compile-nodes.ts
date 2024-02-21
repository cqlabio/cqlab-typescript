import { cloneDeep } from 'lodash';
import {
  FlowImplementation,
  NodeRegistrar,
} from '../flow-implementation/flow-implementation';
import {
  LogicEnum,
  DefinitionNodeTypeEnum,
  NextTypeEnum,
  FlowDefinitionTypeEnum,
  FieldTypeEnum,
} from '../enums';
import {
  IFlowDefinition,
  ILogicLeaf,
  IFlowDefinitionNextNode,
  IFlowDefinitionBooleanNode,
  ITrueFalseNode,
  ICustomFormNode,
  INextBinary,
  IEmitDataNode,
  IMultiOptionFieldNode,
  IBranchNode,
  ITextFieldNode,
  IFormFieldNode,
  INumberFieldNode,
  INextMultiOption,
  IMultiOptionNode,
  IActionNode,
} from '../flow-definition';
import {
  BaseNode,
  FlowNode,
  StartNode,
  EndNode,
  YesNoNode,
  ActionNode,
  EmitDataNode,
  ExecNode,
  // ILogicTreeItem,
  // ILogicTreeNode,
  isBooleanNode,
  // INextBinary,
  isNextNode,
  // IBaseNextNode,
  SubFlowNode,
  BranchChoiceNode,
  MessageNode,
  NarrativeNode,
  CustomFormNode,
  MultiOptionFieldNode,
  TextFieldNode,
  NumberFieldNode,
  ActionDummyNode,
} from '../flow-nodes';
import { IFlowDefinitionNode, ILogicTreeNode } from '../flow-definition';
// import { IBaseBooleanNode } from '../flow-nodes/abstract/boolean-node';
import { FlowContext } from '../flow-context/flow-context';
import { TernaryEnum } from '../enums';
import { JSONSchema7 } from 'json-schema';
import { MultiOptionExecNode } from '../flow-nodes/multi-option-node';

export function compileNodes(
  flowImplementation: FlowImplementation,
  flowDefinition: IFlowDefinition
): Record<string, BaseNode> {
  const newNodes: Record<string, BaseNode> = {};

  const nodes = expandNodes(flowDefinition.nodes);

  Object.keys(nodes).forEach((nodeId) => {
    const rawNode = nodes[nodeId];

    let implementationNode: BaseNode | null = null;

    if (rawNode.nodeType === DefinitionNodeTypeEnum.Start) {
      implementationNode = new StartNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.End) {
      implementationNode = new EndNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.Narrative) {
      implementationNode = new NarrativeNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.SubFlow) {
      implementationNode = new SubFlowNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
      implementationNode = compileTrueFalseNode(flowImplementation, rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.MultiOption) {
      implementationNode = compileMultiOptionNode(flowImplementation, rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.EmitData) {
      implementationNode = compileEmitDataNode(flowImplementation, rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.Action) {
      implementationNode = compileActionNode(flowImplementation, rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.CustomForm) {
      implementationNode = compileCustomFormNode(flowImplementation, rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.FormField) {
      implementationNode = compileFormFieldNode(flowImplementation, rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.Branch) {
      implementationNode = compileBranchNode(flowImplementation, rawNode);
    }
    if (implementationNode && implementationNode.getDefinitionId()) {
      flowImplementation.nodes[implementationNode.getDefinitionId()] =
        implementationNode;
    }
  });

  return {
    ...flowImplementation.nodes,
    ...newNodes,
  };
}

function compileTrueFalseNode(
  flowImplementation: FlowImplementation,
  rawNode: ITrueFalseNode
): BaseNode {
  const trueFalseRegistrar =
    flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.TrueFalse];

  if (rawNode.bindId && trueFalseRegistrar[rawNode.bindId]) {
    return trueFalseRegistrar[rawNode.bindId](rawNode);
  }

  if (
    flowImplementation.getImplementationType() ===
    FlowDefinitionTypeEnum.Interactive
  ) {
    return new YesNoNode(rawNode);
  } else {
    const execNode = new ExecNode(rawNode);
    // If there is no executor, then we assume it is a false node
    execNode.setExecutor(() => {
      return Promise.resolve(TernaryEnum.FALSE);
    });
    return execNode;
  }
}

function compileMultiOptionNode(
  flowImplementation: FlowImplementation,
  rawNode: IMultiOptionNode
): BaseNode {
  // const multiRegistrar =
  //   flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.MultiOption];

  // if (rawNode.bindId && multiRegistrar[rawNode.bindId]) {
  //   return multiRegistrar[rawNode.bindId](rawNode);
  // }

  return new MultiOptionExecNode(rawNode);
}

class DefaultCustomFormNode extends CustomFormNode {
  getValueJsonSchema(): JSONSchema7 {
    return {
      type: 'object',
      properties: {
        value: {
          type: 'string',
          description:
            'Dummy configuration. Must me implemented with Flow Implementation',
        },
      },
    };
  }
}

function compileCustomFormNode(
  flowImplementation: FlowImplementation,
  rawNode: ICustomFormNode
): BaseNode {
  const customDataRegistrar =
    flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.CustomForm];

  if (rawNode.bindId && customDataRegistrar[rawNode.bindId]) {
    return customDataRegistrar[rawNode.bindId](rawNode);
  }

  const formNode = new DefaultCustomFormNode(rawNode);

  return formNode;
}

function compileEmitDataNode(
  flowImplementation: FlowImplementation,
  rawNode: IEmitDataNode
): BaseNode {
  const customDataRegistrar =
    flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.EmitData];

  if (rawNode.bindId && customDataRegistrar[rawNode.bindId]) {
    return customDataRegistrar[rawNode.bindId](rawNode);
  }

  return new EmitDataNode(rawNode);
}

function compileActionNode(
  flowImplementation: FlowImplementation,
  rawNode: IActionNode
): BaseNode {
  return new ActionDummyNode(rawNode);
}

function compileBranchNode(
  flowImplementation: FlowImplementation,
  rawNode: IBranchNode
): BaseNode {
  const customDataRegistrar =
    flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.Branch];

  if (rawNode.bindId && customDataRegistrar[rawNode.bindId]) {
    return customDataRegistrar[rawNode.bindId](rawNode);
  }

  return new BranchChoiceNode(rawNode);
}

function compileFormFieldNode(
  flowImplementation: FlowImplementation,
  rawNode: IFormFieldNode
): BaseNode {
  if (rawNode.fieldType === FieldTypeEnum.Text) {
    return compileTextFieldNode(flowImplementation, rawNode);
  } else if (rawNode.fieldType === FieldTypeEnum.Number) {
    return compileNumberFieldNode(flowImplementation, rawNode);
  } else if (rawNode.fieldType === FieldTypeEnum.MultiOption) {
    return compileMultiOptionFieldNode(flowImplementation, rawNode);
  }
  throw new Error(`Unexpected field type for node: ` + rawNode);
}

function compileTextFieldNode(
  flowImplementation: FlowImplementation,
  rawNode: ITextFieldNode
): BaseNode {
  const textRegistrar =
    flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.FormField][
      FieldTypeEnum.Text
    ];

  if (rawNode.bindId && textRegistrar[rawNode.bindId]) {
    return textRegistrar[rawNode.bindId](rawNode);
  }

  return new TextFieldNode(rawNode);
}

function compileNumberFieldNode(
  flowImplementation: FlowImplementation,
  rawNode: INumberFieldNode
): BaseNode {
  const numberRegistrar =
    flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.FormField][
      FieldTypeEnum.Number
    ];

  if (rawNode.bindId && numberRegistrar[rawNode.bindId]) {
    return numberRegistrar[rawNode.bindId](rawNode);
  }

  return new NumberFieldNode(rawNode);
}
function compileMultiOptionFieldNode(
  flowImplementation: FlowImplementation,
  rawNode: IMultiOptionFieldNode
): BaseNode {
  // const customDataRegistrar =
  //   flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.OptionSelect];

  // if (rawNode.bindId && customDataRegistrar[rawNode.bindId]) {
  //   return customDataRegistrar[rawNode.bindId](rawNode);
  // }

  return new MultiOptionFieldNode(rawNode);
}

// export function compileNodes<C extends FlowContext<any,any>>(
//   instance: FlowImplementation<C>,
//   flowDefinition: IFlowDefinition
// ): Record<string, BaseNode<C>> {
//   const newNodes: Record<string, BaseNode<C>> = {};

//   if (flowDefinition) {
//     const nodes = expandNodes(flowDefinition.nodes);

//     // const nodes = flowDefinition.nodes;

//     Object.keys(nodes).forEach((nodeId) => {
//       const rawNode = nodes[nodeId];

//       let implementationNode: BaseNode<C> | null = null;

//       const klass =
//         instance.boundKlasses[rawNode.bindId as string] ||
//         instance.boundKlasses[rawNode.id];

//       if (rawNode.nodeType ===DefinitionNodeTypeEnum.EmitData ) {

//           const func = instance.registeredNodes[rawNode.id]
//           const node = func(rawNode)
//       }

//       if (klass) {
//         implementationNode = new klass(rawNode);
//         // instance.nodes[nodeId] = new klass(rawNode);
//       } else {
//         // Common between implementation types
//         if (rawNode.nodeType === DefinitionNodeTypeEnum.Start) {
//           implementationNode = new StartNode<C>(rawNode);
//         } else if (rawNode.nodeType === DefinitionNodeTypeEnum.End) {
//           implementationNode = new EndNode<C>(rawNode);
//         } else if (rawNode.nodeType === DefinitionNodeTypeEnum.EmitData) {
//           implementationNode = new EmitDataNode<C, any>(rawNode);
//         } else if (rawNode.nodeType === DefinitionNodeTypeEnum.Narrative) {
//           implementationNode = new NarrativeNode(rawNode);
//         } else if (rawNode.nodeType === DefinitionNodeTypeEnum.SubFlow) {
//           instance.nodes[nodeId] = new SubFlowNode<C>(rawNode);
//         } else if (rawNode.nodeType === DefinitionNodeTypeEnum.Action) {
//           instance.nodes[nodeId] = new ActionNode<C>(rawNode);
//         }

//         if (
//           instance.getImplementationType() ===
//           FlowDefinitionTypeEnum.Interactive
//         ) {
//           // Assume it's an interactive node
//           if (rawNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
//             implementationNode = new YesNoNode<C>(rawNode);
//           } else if (rawNode.nodeType === DefinitionNodeTypeEnum.Branch) {
//             implementationNode = new BranchChoiceNode(rawNode);
//           }
//         } else if (
//           instance.getImplementationType() ===
//           FlowDefinitionTypeEnum.NonInteractive
//         ) {
//           if (rawNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
//             const execNode = new ExecNode<C>(rawNode);

//             // If there is no executor, then we assume it is a false node
//             execNode.setExecutor(() => {
//               return TernaryEnum.FALSE;
//             });
//             implementationNode = execNode;
//           }
//         }

//         // else if (rawNode.nodeType === NodeTypeEnum.Action) {
//         // implementationNode = new ActionNode<C>(rawNode);

//         // else if (rawNode.nodeType === NodeTypeEnum.BranchChoice) {
//         //   instance.nodes[nodeId] = new BranchChoiceNode<C>(rawNode);
//         // } else if (rawNode.nodeType === NodeTypeEnum.Message) {
//         //   instance.nodes[nodeId] = new MessageNode<C>(rawNode);
//         // } else {
//         //   throw new Error(`Unknown node type ${rawNode.nodeType}`);
//         // }
//       }

//       if (implementationNode && implementationNode.getDefinitionId()) {
//         instance.nodes[implementationNode.getDefinitionId() as string] =
//           implementationNode;
//       }
//     });
//   }

//   return {
//     ...instance.nodes,
//     ...newNodes,
//   };
// }

export function expandNodes(nodes: Record<string, IFlowDefinitionNode>) {
  const nextNodes = cloneDeep(nodes);

  const mapFromOldToNext: Record<string, string> = {};

  for (const node of Object.values(nextNodes)) {
    if (node.nodeType === DefinitionNodeTypeEnum.LogicTree) {
      const firstNodeId = flattenLogicTreeNode(node, nextNodes);
      // Object.assign(nextNodes, logicTreeSubNodes);
      if (firstNodeId) {
        mapFromOldToNext[node.id] = firstNodeId;
      }
    }
  }

  for (const node of Object.values(nextNodes)) {
    if (isBooleanNode(node)) {
      const booleanNode = node as IFlowDefinitionBooleanNode;
      const next: INextBinary = booleanNode.next
        ? { ...booleanNode.next }
        : {
            type: NextTypeEnum.Binary,
          };
      if (mapFromOldToNext[booleanNode.next?.trueId as string]) {
        next.trueId = mapFromOldToNext[booleanNode.next?.trueId as string];
      }
      if (mapFromOldToNext[booleanNode.next?.falseId as string]) {
        next.falseId = mapFromOldToNext[booleanNode.next?.falseId as string];
      }
      booleanNode.next = next;
    }
    if (isNextNode(node)) {
      const nextNode = node as IFlowDefinitionNextNode;
      if (nextNode.next && mapFromOldToNext[nextNode.next?.id as string]) {
        nextNode.next.id = mapFromOldToNext[nextNode.next?.id as string];
      }
    }
    // node.skipRender = false;
  }

  Object.keys(mapFromOldToNext).forEach((oldId) => {
    delete nextNodes[oldId];
  });

  return nextNodes;
}

function flattenLogicTreeNode(
  logicTreeNode: ILogicTreeNode,
  allNodes: Record<string, IFlowDefinitionNode>
): string | null {
  const onPassId = logicTreeNode.next?.trueId || null;
  const onFailId = logicTreeNode.next?.falseId || null;

  const node = recurseLogicTreeNode(
    logicTreeNode.logicTree || null,
    allNodes,
    onPassId,
    onFailId
  );

  if (!node) {
    return onPassId;
  }

  return node.id;
  // return null;
}

// TODO: Modify recursion to not require allNodes, and just return a map of nodes
function recurseLogicTreeNode(
  logicNode: ILogicLeaf | null,
  allNodes: Record<string, IFlowDefinitionNode>,
  onPassId: string | null,
  onFailId: string | null
): IFlowDefinitionNode | null {
  if (!logicNode) {
    return null;
  }

  if (logicNode.logicType === LogicEnum.And) {
    logicNode.children.forEach((child, index) => {
      // Is last child
      if (index === logicNode.children.length - 1) {
        recurseLogicTreeNode(child, allNodes, onPassId, onFailId);
      } else {
        const nextNode = getNextTrueFalseLeafNode(
          logicNode.children[index + 1],
          allNodes
        );
        if (nextNode) {
          recurseLogicTreeNode(child, allNodes, nextNode.id, onFailId);
        }
      }
    });
  } else if (logicNode.logicType === LogicEnum.Or) {
    logicNode.children.forEach((child, index) => {
      // Is last child
      if (index === logicNode.children.length - 1) {
        recurseLogicTreeNode(child, allNodes, onPassId, onFailId);
      } else {
        const nextNode = getNextTrueFalseLeafNode(
          logicNode.children[index + 1],
          allNodes
        );
        if (nextNode) {
          recurseLogicTreeNode(child, allNodes, onPassId, nextNode.id);
        }
      }
    });
  } else if (logicNode.logicType === LogicEnum.TrueFalseLeaf) {
    // Convert from leafTrueFalseNode to trueFalseNode
    allNodes[logicNode.id] = {
      ...logicNode,
      nodeType: DefinitionNodeTypeEnum.TrueFalse,
      next: {
        type: NextTypeEnum.Binary,
        trueId: onPassId || undefined,
        falseId: onFailId || undefined,
      },
    };
  }
  return getNextTrueFalseLeafNode(logicNode, allNodes);
}

function getNextTrueFalseLeafNode(
  treeNode: ILogicLeaf | null,
  allNodes: Record<string, IFlowDefinitionNode>
): IFlowDefinitionNode | null {
  if (!treeNode) {
    return null;
  }

  if (
    treeNode.logicType === LogicEnum.And ||
    treeNode.logicType === LogicEnum.Or
  ) {
    for (const child of treeNode.children) {
      const found = getNextTrueFalseLeafNode(child, allNodes);
      if (found) {
        return found;
      }
    }
  }

  if (treeNode.logicType === LogicEnum.TrueFalseLeaf) {
    return treeNode;
    // return allNodes[treeNode.referenceId as string] || null;
  }

  return null;
}
