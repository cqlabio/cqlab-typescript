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
} from '../enums';
import {
  IFlowDefintion,
  ILogicLeaf,
  IFlowDefinitionNextNode,
  IFlowDefinitionBooleanNode,
  ITrueFalseNode,
  IInputDataNode,
  INextBinary,
} from '../flow-definition/flow-definition';
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
  CustomDataInputNode,
} from '../flow-nodes';
import {
  IFlowDefinitionNode,
  ILogicTreeNode,
} from '../flow-definition/flow-definition';
// import { IBaseBooleanNode } from '../flow-nodes/abstract/boolean-node';
import { FlowContext } from '../flow-context/flow-context';
import { TernaryEnum } from '../enums';

function compileTrueFaleNode(
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
      return TernaryEnum.FALSE;
    });
    return execNode;
  }
}

function compileInputDataNode(
  flowImplementation: FlowImplementation,
  rawNode: IInputDataNode
): BaseNode {
  const customDataRegistrar =
    flowImplementation.getRegistrar()[DefinitionNodeTypeEnum.InputData];

  if (rawNode.bindId && customDataRegistrar[rawNode.bindId]) {
    return customDataRegistrar[rawNode.bindId](rawNode);
  }

  throw new Error(
    `Missing custom data registrar for node: ${rawNode.id} with bindId: ${rawNode.bindId} `
  );
}

export function compileNodes(
  instance: FlowImplementation,
  flowDefinition: IFlowDefintion
): Record<string, BaseNode> {
  const newNodes: Record<string, BaseNode> = {};

  const nodes = expandNodes(flowDefinition.nodes);

  Object.keys(nodes).forEach((nodeId) => {
    const rawNode = nodes[nodeId];

    let implementationNode: BaseNode | null = null;

    const registrar = instance.getRegistrar();

    // if (rawNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
    //   const trueFalseRegistrar = registrar[DefinitionNodeTypeEnum.TrueFalse];

    //   const func = rawNode.id in trueFalseRegistrar
    //     ? trueFalseRegistrar[rawNode.id]
    //     : null

    //   if (func) {
    //     implementationNode = func(rawNode);
    //   }
    // }

    // const klass =
    //   instance.boundKlasses[rawNode.bindId as string] ||
    //   instance.boundKlasses[rawNode.id];

    // if (rawNode.nodeType ===DefinitionNodeTypeEnum.EmitData ) {

    //     const func = instance.registeredNodes[rawNode.id]
    //     const node = func(rawNode)
    // }

    // if (klass) {
    //   implementationNode = new klass(rawNode);
    //   // instance.nodes[nodeId] = new klass(rawNode);
    // } else {
    // Common between implementation types
    if (rawNode.nodeType === DefinitionNodeTypeEnum.Start) {
      implementationNode = new StartNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.End) {
      implementationNode = new EndNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.EmitData) {
      implementationNode = new EmitDataNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.Narrative) {
      implementationNode = new NarrativeNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.SubFlow) {
      instance.nodes[nodeId] = new SubFlowNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.Action) {
      instance.nodes[nodeId] = new ActionNode(rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
      instance.nodes[nodeId] = compileTrueFaleNode(instance, rawNode);
    } else if (rawNode.nodeType === DefinitionNodeTypeEnum.InputData) {
      instance.nodes[nodeId] = compileInputDataNode(instance, rawNode);
    }

    if (
      instance.getImplementationType() === FlowDefinitionTypeEnum.Interactive
    ) {
      // Assume it's an interactive node
      // if (rawNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
      //   implementationNode = new YesNoNode<C>(rawNode);
      // } else

      if (rawNode.nodeType === DefinitionNodeTypeEnum.Branch) {
        implementationNode = new BranchChoiceNode(rawNode);
      }
    }

    // else if (
    //   instance.getImplementationType() ===
    //   FlowDefinitionTypeEnum.NonInteractive
    // ) {
    //   if (rawNode.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
    //     const execNode = new ExecNode<C>(rawNode);

    //     // If there is no executor, then we assume it is a false node
    //     execNode.setExecutor(() => {
    //       return TernaryEnum.FALSE;
    //     });
    //     implementationNode = execNode;
    //   }
    // }

    // else if (rawNode.nodeType === NodeTypeEnum.Action) {
    // implementationNode = new ActionNode<C>(rawNode);

    // else if (rawNode.nodeType === NodeTypeEnum.BranchChoice) {
    //   instance.nodes[nodeId] = new BranchChoiceNode<C>(rawNode);
    // } else if (rawNode.nodeType === NodeTypeEnum.Message) {
    //   instance.nodes[nodeId] = new MessageNode<C>(rawNode);
    // } else {
    //   throw new Error(`Unknown node type ${rawNode.nodeType}`);
    // }
    // }

    if (implementationNode && implementationNode.getDefinitionId()) {
      instance.nodes[implementationNode.getDefinitionId() as string] =
        implementationNode;
    }
  });

  return {
    ...instance.nodes,
    ...newNodes,
  };
}

// export function compileNodes<C extends FlowContext<any,any>>(
//   instance: FlowImplementation<C>,
//   flowDefinition: IFlowDefintion
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
    node.skipRender = false;
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
