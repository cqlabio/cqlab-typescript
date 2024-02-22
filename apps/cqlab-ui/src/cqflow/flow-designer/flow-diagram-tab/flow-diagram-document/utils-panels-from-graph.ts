import keyBy from 'lodash/keyBy';
import {
  IFlowDefinitionNode,
  DefinitionNodeTypeEnum,
  isBooleanNode,
  isNextNode,
  IFlowDefinitionNextNode,
  IFlowDefinitionBooleanNode,
} from '@cqlab/cqflow-core';

export function createPanelsFromFlowDefinition(
  initialNodes: IFlowDefinitionNode[]
): IFlowDefinitionNode[] {
  const resultNodes: IFlowDefinitionNode[] = [];

  const nodeLookup = keyBy(initialNodes, 'id');

  function recurseNode(nodeId: string | undefined) {
    const node = nodeLookup[nodeId || ''];

    if (!node) {
      return;
    }

    if (node.nodeType === DefinitionNodeTypeEnum.End) {
      return;
    }

    if (node.nodeType !== DefinitionNodeTypeEnum.Start) {
      resultNodes.push(node);
    }

    if (isNextNode(node)) {
      const nextNode = node as IFlowDefinitionNextNode;
      recurseNode(nextNode.next?.id);
    } else if (isBooleanNode(node)) {
      const boolNode = node as IFlowDefinitionBooleanNode;
      recurseNode(boolNode.next?.trueId);
      recurseNode(boolNode.next?.falseId);
    } else if (node.nodeType === DefinitionNodeTypeEnum.Branch) {
      console.log('Doo me');
    } else {
      throw new Error('Not expecting nodeType: ' + node.nodeType);
    }
    // if (node.nodeType !== FlowNodeTypeEnum.start) {
    //   resultNodes.push(node);
    // }

    // if (
    //   node.nodeType === FlowNodeTypeEnum.start ||
    //   node.nodeType === FlowNodeTypeEnum.dataHook ||
    //   node.nodeType === FlowNodeTypeEnum.multiChoice ||
    //   node.nodeType === FlowNodeTypeEnum.documentation ||
    //   node.nodeType === FlowNodeTypeEnum.info
    // ) {
    //   recurseNode(node.node.next?.nextNodelId);
    // } else if (
    //   node.nodeType === FlowNodeTypeEnum.cql ||
    //   node.nodeType === FlowNodeTypeEnum.parameter ||
    //   node.nodeType === FlowNodeTypeEnum.logicTree
    // ) {
    //   recurseNode(node.node.onPass?.nextNodelId);
    //   recurseNode(node.node.onFail?.nextNodelId);
    // } else if (node.nodeType === FlowNodeTypeEnum.userDecision) {
    //   node.node.options.forEach((option) => {
    //     recurseNode(option.next?.nextNodelId);
    //   });
    // } else if (node.nodeType === FlowNodeTypeEnum.linearEval) {
    //   node.node.options.forEach((option) => {
    //     recurseNode(option.next?.nextNodelId);
    //   });
    //   recurseNode(node.node.defaultOption.next?.nextNodelId);
    // }

    // resultNodes.push(node.node);
    // const edges = graph.edges.filter((e) => e.from === node.id);
    // edges.forEach((edge) => {
    //   const node = graph.nodes.find((n) => n.id === edge.to);
    //   recurseNode(node);
    // });
  }

  const rootNode = initialNodes.find(
    (n) => n.nodeType === DefinitionNodeTypeEnum.Start
  );

  console.log(rootNode, initialNodes);

  recurseNode(rootNode?.id || '');

  const reverseNodes: IFlowDefinitionNode[] = [];
  const doneIds = new Set();

  // This makes sure the last occurence shows up first.
  for (let i = resultNodes.length - 1; i >= 0; i--) {
    if (!doneIds.has(resultNodes[i])) {
      reverseNodes.push(resultNodes[i]);
      doneIds.add(resultNodes[i]);
    }
  }

  return reverseNodes.reverse();
}
