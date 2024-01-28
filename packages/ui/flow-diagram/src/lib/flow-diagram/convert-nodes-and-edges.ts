import { MarkerType, Node, Edge } from 'reactflow';
import last from 'lodash/last';
import {
  IFlowDefinitionNode,
  IFlowDefinitionBooleanNode,
  IFlowDefinitionNextNode,
  isBooleanNode,
  isNextNode,
  DefinitionNodeTypeEnum,
} from '@cqlab/cqflow-core';
import { alphabet } from './flow-diagram-nodes/common/multi-choice-picker';
export const NODE_DEFAULT_WIDTH = 150;
export const NODE_DEFAULT_HEIGHT = 80;

const BRANCH_OPT_PREFIX = 'branch-option:';

export function getOptionIdFromEdgeId(edgeId: string) {
  return edgeId.replace(BRANCH_OPT_PREFIX, '');
}

// const EDGE_TYPE = 'floating';
const EDGE_TYPE = 'step';

export enum ValidationEnum {
  VALID = 'valid',
  INVALID = 'invalid',
  OK = 'ok',
}

export type FlowNodeData<T> = {
  node: T;
  editMode: boolean;
  validationStatus?: ValidationEnum;
};

interface EdgeData {
  booleanType: 'true' | 'false';
}

export type EdgeWithData = Edge<null | EdgeData>;

export type ViewFlowNode<T> = Node<FlowNodeData<T>>;

export type LocalFlowNode = ViewFlowNode<IFlowDefinitionNode>;

export function getIndexFromHandleId(handleId: string): string {
  return last(handleId.split('_')) || '';
}

export function createIdFromIndex(id: string): string {
  return `toolbar-branch_${id}`;
}

export function convertNodesAndEdges(
  originalNodes: Record<string, IFlowDefinitionNode>,
  editMode: boolean,
  selectedNodeId: string | null,
  selectedEdgeId: string | null,
  validationResults: any[] | null
) {
  const nodes: LocalFlowNode[] = [];
  const edges: EdgeWithData[] = [];
  const nodeStatuses: Record<string, ValidationEnum> = {};

  if (validationResults) {
    validationResults.forEach((result) => {
      if (result.type === 'node-error') {
        nodeStatuses[result.node.id] = result.isValid
          ? ValidationEnum.VALID
          : ValidationEnum.INVALID;
      }
    });
  }

  Object.keys(originalNodes || {}).forEach((nodeId) => {
    if (!nodeId) {
      return;
    }

    const node = originalNodes[nodeId];
    if (!node) {
      return;
    }

    let validationStatus: ValidationEnum | undefined = undefined;

    if (validationResults) {
      if (nodeStatuses[nodeId]) {
        validationStatus = nodeStatuses[nodeId];
      } else {
        validationStatus = ValidationEnum.OK;
      }
    }

    const reactflowNode: LocalFlowNode = {
      id: nodeId,
      type: node.nodeType,
      position: {
        x: node.position?.x || 0,
        y: node.position?.y || 0,
      },
      // width: node.position?.width || NODE_DEFAULT_WIDTH,
      // height: node.position?.height || NODE_DEFAULT_HEIGHT,
      style: {
        width: node.position?.width || NODE_DEFAULT_WIDTH,
        height: node.position?.height || NODE_DEFAULT_HEIGHT,
      },
      // parentNode: 'A',
      // extent: 'parent',
      data: {
        editMode: editMode,
        validationStatus: validationStatus,

        // !validationResults ? undefined : errors[nodeId] ? ValidationEnum.INVALID : ValidationEnum.VALID,
        node: {
          ...node,
          label: node.label || 'unknown: ' + node.nodeType,
        },
      },
    };

    nodes.push(reactflowNode);

    // const strokeWidth = selectedId === nodeId ? 3 : 1;

    if (isNextNode(node)) {
      const { next } = node as IFlowDefinitionNextNode;

      if (next) {
        const edgeId = nodeId + '_' + next.id;

        const edgeSelected =
          selectedNodeId === node.id || edgeId === selectedEdgeId;

        edges.push({
          id: edgeId,
          source: nodeId,
          target: next.id || '',
          sourceHandle: next.fromHandle || 'bottom',
          targetHandle: next.toHandle || 'top',
          // type: edgeType,
          type: EDGE_TYPE,
          animated: edgeId !== selectedEdgeId,
          updatable: edgeId === selectedEdgeId,
          interactionWidth: !selectedEdgeId ? 20 : 1,
          label: 'Next',
          labelStyle: {
            fill: 'rgb(130,130,130)',
            // fontWeight: 700,
            fontWeight: 600,
            fontFamily: 'Red Hat Display var(--cq-title-font)',
          },
          labelBgStyle: {
            fill: edgeSelected ? 'rgb(230,230,230)' : 'rgb(252,252,252)',
          },

          markerEnd: {
            type: MarkerType.Arrow,
            width: 20,
            height: 20,
            color: '#828282',
          },
          style: {
            stroke: 'rgb(130,130,130)',
            strokeWidth:
              selectedNodeId === node.id || edgeId === selectedEdgeId ? 3 : 1,
          },
        });
      }
      // } else if (node.nodeType === NodeTypeEnum.Exec) {
    } else if (isBooleanNode(node)) {
      const { next } = node as IFlowDefinitionBooleanNode;

      if (next?.trueId) {
        const edgeId = 'true_' + nodeId + '_' + next.trueId;

        const edgeSelected =
          selectedNodeId === node.id || edgeId === selectedEdgeId;

        edges.push({
          id: edgeId,
          source: nodeId,
          target: next.trueId,
          type: EDGE_TYPE,
          animated: edgeId !== selectedEdgeId,
          label: 'True',

          sourceHandle: next.trueFromHandle || 'bottom',
          targetHandle: next.trueToHandle || 'top',
          updatable: edgeId === selectedEdgeId,
          interactionWidth: !selectedEdgeId ? 20 : 1,
          // updatable: 'target',
          // sourceHandle: 'onPass',
          style: {
            stroke: '#66BB6A',
            strokeWidth: edgeSelected ? 3 : 1,
          },
          labelStyle: {
            fill: '#1B5E20',
            // fontWeight: 700,
            fontWeight: 600,
            fontFamily: 'Red Hat Display var(--cq-title-font)',
          },
          labelBgStyle: {
            fill: edgeSelected ? '#E8F5E9' : 'rgb(252,252,252)',
          },
          markerEnd: {
            type: MarkerType.Arrow,
            width: 20,
            height: 20,
            color: 'green',
          },
          data: {
            booleanType: 'true',
          },
        });
      }

      if (next?.falseId) {
        const edgeId = 'false_' + nodeId + '_' + next.falseId;

        const edgeSelected =
          selectedNodeId === node.id || edgeId === selectedEdgeId;

        edges.push({
          id: edgeId,
          source: nodeId,
          target: next.falseId,
          type: EDGE_TYPE,
          animated: edgeId !== selectedEdgeId,
          label: 'False',
          sourceHandle: next.falseFromHandle || 'bottom',
          targetHandle: next.falseToHandle || 'top',
          // updatable: 'target',
          // sourceHandle: 'onPass',
          updatable: edgeId === selectedEdgeId,
          interactionWidth: !selectedEdgeId ? 20 : 1,
          style: {
            stroke: 'rgb(209, 39, 51)',
            strokeWidth: edgeSelected ? 3 : 1,
          },
          labelStyle: {
            fill: '#B71C1C',
            fontWeight: 600,
            fontFamily: 'Red Hat Display var(--cq-title-font)',
          },
          labelBgStyle: {
            fill: edgeSelected ? '#FFEBEE' : 'rgb(252,252,252)',
          },
          markerEnd: {
            type: MarkerType.Arrow,
            width: 20,
            height: 20,
            color: '#D12733',
            strokeWidth: 1,
          },
          data: {
            booleanType: 'false',
          },
        });
      }
    } else if (node.nodeType === DefinitionNodeTypeEnum.Branch) {
      node.next?.options.forEach((option, index) => {
        if (option.toId) {
          const edgeId = BRANCH_OPT_PREFIX + option.id;

          const edgeSelected =
            selectedNodeId === node.id || edgeId === selectedEdgeId;

          edges.push({
            id: edgeId,
            source: nodeId,
            target: option.toId,
            type: EDGE_TYPE,
            animated: edgeId !== selectedEdgeId,
            label: alphabet[index],
            // updatable: edgeId === selectedEdgeId,

            sourceHandle: option.fromHandle || 'bottom',
            targetHandle: option.toHandle || 'top',
            // updatable: 'target',
            // sourceHandle: 'onPass',
            updatable: edgeId === selectedEdgeId,
            interactionWidth: !selectedEdgeId ? 20 : 1,

            labelStyle: {
              fill: 'rgb(130,130,130)',
              // fontWeight: 700,
              fontWeight: 600,
              fontFamily: 'Red Hat Display var(--cq-title-font)',
            },
            labelBgStyle: {
              fill: edgeSelected ? 'rgb(230,230,230)' : 'rgb(252,252,252)',
            },

            markerEnd: {
              type: MarkerType.Arrow,
              width: 20,
              height: 20,
              color: '#828282',
            },
            style: {
              stroke: 'rgb(130,130,130)',
              strokeWidth: edgeSelected ? 3 : 1,
            },
          });
        }
      });
    }
  });

  // nodes.push(  {
  //   id: 'A',
  //   type: 'group',
  //   // @ts-expect-error: lshdskj
  //   data: null,
  //   position: { x: 0, y: 0 },
  //   style: {
  //     width: 1000,
  //     height: 1000,
  //   },
  // },)

  // return { nodes, edges };
  return { nodes, edges };
}
