import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from 'react';
import last from 'lodash/last';
import cloneDeep from 'lodash/cloneDeep';
import { shallow } from 'zustand/shallow';
import Box from '@mui/material/Box';
import debounce from 'lodash/debounce';
import { useDrop } from 'react-dnd';
import 'reactflow/dist/style.css';
import {
  IFlowDefinitionBooleanNode,
  IFlowDefinitionNextNode,
  NextTypeEnum,
  DefinitionNodeTypeEnum,
  isBooleanNode,
  isNextNode,
  IBranchNode,
  INextUnary,
  INextBinary,
  IFlowDefinitionNode,
} from '@cqlab/cqflow-core';

// import {

import {
  NEW_FLOW_NODE,
  NewFlowNode,
} from '../flow-diagram-toolbar/draggable-new-node';
import { newNodeTemplates } from './node-templates';
import { useFlowStore } from '../../../flow-store';
import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  BackgroundVariant,
  Background,
  NodeDimensionChange,
  ReactFlowInstance,
  ConnectionMode,
  useReactFlow,
  Connection,
  Position,
  Edge,
  Rect,
  OnConnectStartParams,
  updateEdge,
  useNodes,
  Controls,
  SelectionDragHandler,
  useViewport,
  useStore,
  useOnSelectionChange,
} from 'reactflow';
import { NodeOp } from '../../../../data/utils';
import { FlowDesignerContext } from '../../flow-designer-context';

import {
  flowDiagramNodeTypes,
  flowDiagramEdgesTypes,
  getIndexFromHandleId,
  convertNodesAndEdges,
  LocalFlowNode,
  NODE_DEFAULT_HEIGHT,
  NODE_DEFAULT_WIDTH,
  FlowDiagramContext,
  CustomConnectionLine,
  EdgeWithData,
  getPossibleHandles,
  getClosestCoord,
  getOptionIdFromEdgeId,
  CreatingEdge,
  // } from '@cqlab/cqflow-react-components';
} from '@cqlab/ui-flow-diagram';
import compact from 'lodash/compact';
import { cloneCopyPasteState } from './utils';

interface NodesAndEdges {
  nodes: LocalFlowNode[];
  edges: Edge[];
}

export function FlowDiagram() {
  const { zoom } = useViewport();
  const {
    setSelectedNodeId,
    setSelectedLeafNodeId,
    selectedNodeId,
    setFlowCopyPasteState,
    flowCopyPasteState,
    setSelectedBranchOptionId,
  } = useFlowStore(
    (state) => ({
      setSelectedNodeId: state.setSelectedNodeId,
      setSelectedLeafNodeId: state.setSelectedLeafNodeId,
      selectedNodeId: state.selectedNodeId,
      setFlowCopyPasteState: state.setFlowCopyPasteState,
      flowCopyPasteState: state.flowCopyPasteState,
      setSelectedBranchOptionId: state.setSelectedBranchOptionId,
    }),
    shallow
  );

  const {
    flowDefinition,
    doNodeUpdates,
    undoFlowDefOperation,
    redoFlowDefOperation,
  } = useContext(FlowDesignerContext);

  const [creatingEdge, updateCreatingEdge] = useState<CreatingEdge | null>(
    null
  );

  const reactFlowWrapper = useRef<HTMLElement>(null);
  // const currentHandleConnect = useRef<LocalConnectParam | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const [selectedNodesAndEdges, setSelectedNodesAndEdges] =
    useState<NodesAndEdges | null>(null);

  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // const { getIntersectingNodes } = useReactFlow();

  const setSelectedNodesForCopyPaste = useCallback(
    ({ nodes, edges }: NodesAndEdges) => {
      if (nodes.length === 0) {
        setSelectedNodesAndEdges(null);
      } else {
        setSelectedNodesAndEdges({ nodes, edges });
      }
    },
    [setSelectedNodesAndEdges]
  );

  useOnSelectionChange({
    onChange: ({ nodes, edges }: NodesAndEdges): void =>
      setSelectedNodesForCopyPaste({ nodes, edges }),
  });

  /* 
  const onConnectStart = useCallback(
    (event: any, params: OnConnectStartParams) => {
      currentHandleConnect.current = {
        sourceId: params.nodeId || '',
        handleId: params.handleId || '',
      };
    },
    []
  );

  const onConnectEnd = useCallback(
    (event: any) => {
      if (!reactFlowWrapper?.current || !reactFlowInstance) {
        return;
      }

      // TODO: If target is "start" node, or if target is same as source, do nothing

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const rect: Rect = {
        x: position.x,
        y: position.y,
        width: 1,
        height: 1,
      };

      const intersecting = getIntersectingNodes(rect);

      if (intersecting.length === 0) {
        return;
      }

      const targetId = intersecting[0].id;
      const sourceNode =
        flowDefinition.nodes[currentHandleConnect.current?.sourceId || ''];
      const handleId = currentHandleConnect.current?.handleId || '';

      if (isNextNode(sourceNode)) {
        const definedNode = sourceNode as IFlowDefinitionNextNode;
        // const { next } = node as IBaseNextNode;

        const nextNode: IFlowDefinitionNextNode = {
          ...definedNode,
          next: {
            type: NextTypeEnum.Unary,
            id: targetId || undefined,
          },
        };

        doNodeUpdates({
          op: 'update',
          node: nextNode,
        });
      } else if (isBooleanNode(sourceNode)) {
        const boolNode = sourceNode as IFlowDefinitionBooleanNode;

        const nextBooleanNode: IFlowDefinitionBooleanNode = {
          ...boolNode,
          next: {
            type: NextTypeEnum.Binary,
            trueId:
              handleId === 'onTrue'
                ? targetId || undefined
                : boolNode.next?.trueId,
            falseId:
              handleId === 'onFalse'
                ? targetId || undefined
                : boolNode.next?.falseId,
          },
        };

        doNodeUpdates({
          op: 'update',
          node: nextBooleanNode,
        });
      } else if (sourceNode.nodeType === DefinitionNodeTypeEnum.Branch) {
        const branchNode = sourceNode as IBranchNode;

        if (!sourceNode.next) {
          return;
        }

        const itemIndex = getIndexFromHandleId(handleId);

        const nextOptions = cloneDeep(sourceNode.next.options);

        nextOptions[itemIndex] = {
          ...nextOptions[itemIndex],
          id: targetId,
        };

        doNodeUpdates({
          op: 'update',
          node: {
            ...sourceNode,
            next: {
              ...sourceNode.next,
              options: nextOptions,
            },
          },
        });
      } else {
        console.error('Unable to connect nodeType: ' + sourceNode.nodeType);
      }
    },
    [flowDefinition, doNodeUpdates, reactFlowInstance, getIntersectingNodes]
  );

*/

  useEffect(() => {
    if (!flowDefinition) {
      return;
    }

    const { nodes: reactflowNodes, edges: reactflowEdges } =
      convertNodesAndEdges(
        flowDefinition.nodes,
        true,
        selectedNodeId,
        selectedEdgeId,
        null
      );

    setNodes([...reactflowNodes]);
    setEdges([...reactflowEdges]);
  }, [flowDefinition, setEdges, setNodes, selectedEdgeId, selectedNodeId]);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('ON-CONNECTsss', params);

      try {
        if (!flowDefinition) {
          return;
        }

        const sourceNode = flowDefinition.nodes[params.source as string];
        const targetNode = flowDefinition.nodes[params.target as string];

        if (!sourceNode || !targetNode || !creatingEdge) {
          return;
        }

        if (sourceNode.id === targetNode.id) {
          return;
        }

        // if (!params.sourceHandle?.startsWith('toolbar')) {
        //   throw new Error(
        //     'OnConnect Source handle must start with prefix: toolbar'
        //   );
        // }

        const reactFlowSourceNode = nodes.find(
          (n) => n.id === sourceNode.id
        ) as LocalFlowNode;

        const reactFlowTargetNode = nodes.find(
          (n) => n.id === targetNode.id
        ) as LocalFlowNode;

        // const sourcePossibleHandles = getPossibleHandles(reactFlowSourceNode);
        // const targetPossibleHandles = getPossibleHandles(reactFlowTargetNode);

        // const targetHandle =
        //   targetPossibleHandles[params.targetHandle as Position];

        // We need to find the closest target handle to the chosen source
        // const closestSource = getClosestCoord(
        //   {
        //     x: targetHandle.x,
        //     y: targetHandle.y,
        //     position: targetHandle.position,
        //   },
        //   Object.values(sourcePossibleHandles)
        // );

        const fromHandle = params.sourceHandle as
          | 'top'
          | 'right'
          | 'bottom'
          | 'left';

        const toHandle = params.targetHandle as
          | 'top'
          | 'right'
          | 'bottom'
          | 'left';

        if (isNextNode(sourceNode)) {
          const definedNode = sourceNode as IFlowDefinitionNextNode;

          const nextNode: IFlowDefinitionNextNode = {
            ...definedNode,
            next: {
              type: NextTypeEnum.Unary,
              id: targetNode.id,
              fromHandle: fromHandle,
              toHandle: toHandle,
            },
          };

          doNodeUpdates({
            op: 'update',
            node: nextNode,
          });
        } else if (isBooleanNode(sourceNode)) {
          const boolNode = sourceNode as IFlowDefinitionBooleanNode;

          const boolNext: INextBinary = boolNode.next
            ? cloneDeep(boolNode.next)
            : {
                type: NextTypeEnum.Binary,
              };

          // onTrue or onFalse
          // const type = last(params.sourceHandle.split('-'));
          const type = creatingEdge.index === 0 ? 'onTrue' : 'onFalse';

          if (type === 'onTrue') {
            boolNext.trueId = targetNode.id;
            boolNext.trueFromHandle = fromHandle;
            boolNext.trueToHandle = toHandle;
          } else if (type === 'onFalse') {
            boolNext.falseId = targetNode.id;
            boolNext.falseFromHandle = fromHandle;
            boolNext.falseToHandle = toHandle;
          }

          const nextBooleanNode: IFlowDefinitionBooleanNode = {
            ...boolNode,
            next: boolNext,
          };

          doNodeUpdates({
            op: 'update',
            node: nextBooleanNode,
          });
        } else if (sourceNode.nodeType === DefinitionNodeTypeEnum.Branch) {
          if (!sourceNode.next) {
            return;
          }

          // const optionId = getIndexFromHandleId(params.sourceHandle);

          const nextOptions = sourceNode.next.options.map((o, index) => {
            if (creatingEdge.index === index) {
              return {
                ...o,
                toId: targetNode.id,
                fromHandle: fromHandle,
                toHandle: toHandle,
              };
            }
            return { ...o };
          });

          doNodeUpdates({
            op: 'update',
            node: {
              ...sourceNode,
              next: {
                ...sourceNode.next,
                options: nextOptions,
              },
            },
          });
        }

        updateCreatingEdge(null);
      } catch (e) {
        console.error('CQFLOW ERROR: Unable to connect nodes', e);
      }
    },
    [flowDefinition, doNodeUpdates, nodes, creatingEdge, updateCreatingEdge]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge: EdgeWithData, newConnection: Connection) => {
      if (!flowDefinition) {
        return;
      }

      const sourceNode = flowDefinition.nodes[newConnection.source as string];
      const targetNode = flowDefinition.nodes[newConnection.target as string];

      if (!sourceNode || !targetNode) {
        return;
      }

      const newSourceHandle = newConnection.sourceHandle as
        | 'top'
        | 'right'
        | 'bottom'
        | 'left';

      const newTargetHandle = newConnection.targetHandle as
        | 'top'
        | 'right'
        | 'bottom'
        | 'left';

      if (isNextNode(sourceNode)) {
        const definedNode = sourceNode as IFlowDefinitionNextNode;

        if (!definedNode.next) {
          return;
        }

        const nextNode: IFlowDefinitionNextNode = {
          ...definedNode,
          next: {
            ...definedNode.next,
            fromHandle: newSourceHandle,
            id: targetNode.id,
            toHandle: newTargetHandle,
          },
        };

        doNodeUpdates({
          op: 'update',
          node: nextNode,
        });
      } else if (isBooleanNode(sourceNode)) {
        const boolNode = sourceNode as IFlowDefinitionBooleanNode;

        const currentNext = cloneDeep(boolNode.next);

        if (!currentNext) {
          return;
        }

        if (oldEdge.data?.booleanType === 'true') {
          currentNext.trueId = targetNode.id;
          currentNext.trueFromHandle = newSourceHandle;
          currentNext.trueToHandle = newTargetHandle;
        } else if (oldEdge.data?.booleanType === 'false') {
          currentNext.falseId = targetNode.id;
          currentNext.falseFromHandle = newSourceHandle;
          currentNext.falseToHandle = newTargetHandle;
        }

        const nextBooleanNode: IFlowDefinitionBooleanNode = {
          ...boolNode,
          next: currentNext,
        };

        doNodeUpdates({
          op: 'update',
          node: nextBooleanNode,
        });
      } else if (sourceNode.nodeType === DefinitionNodeTypeEnum.Branch) {
        if (!sourceNode.next) {
          return;
        }

        const optionId = getOptionIdFromEdgeId(oldEdge.id);

        const nextOptions = sourceNode.next.options.map((o) => {
          if (o.id === optionId) {
            return {
              ...o,
              fromHandle: newSourceHandle,
              toHandle: newTargetHandle,
              toId: targetNode.id,
            };
          }
          return { ...o };
        });

        doNodeUpdates({
          op: 'update',
          node: {
            ...sourceNode,
            next: {
              ...sourceNode.next,
              options: nextOptions,
            },
          },
        });
      }
    },
    [flowDefinition, doNodeUpdates]
  );

  const [{ isOver }, drop] = useDrop<
    NewFlowNode,
    void,
    {
      isOver: boolean;
    }
  >(
    () => ({
      accept: NEW_FLOW_NODE,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
      drop: (item: NewFlowNode, monitor) => {
        // console.log('eherlkjher drop');

        if (!reactFlowWrapper.current || !reactFlowInstance) {
          return;
        }
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();

        const clientDropPosition = monitor.getClientOffset();

        if (!clientDropPosition) {
          return;
        }

        const nodeTemplate = newNodeTemplates[item.flowNodeType]();

        if (!nodeTemplate) {
          throw new Error(`Could not find template for item ${item}`);
        }

        const position = reactFlowInstance.project({
          x: clientDropPosition.x - reactFlowBounds.left,
          y: clientDropPosition.y - reactFlowBounds.top,
        });

        nodeTemplate.position = {
          height: NODE_DEFAULT_HEIGHT,
          width: NODE_DEFAULT_WIDTH,
          ...nodeTemplate.position,
          x: position.x,
          y: position.y,
        };

        doNodeUpdates({
          op: 'update',
          node: nodeTemplate,
        });
        setSelectedNodeId(nodeTemplate.id);
      },
    }),
    [
      reactFlowWrapper?.current,
      doNodeUpdates,
      setSelectedNodeId,
      reactFlowInstance,
    ]
  );

  const onNodeDragStop = useCallback(
    (e: any, node: LocalFlowNode) => {
      if (!flowDefinition) {
        return;
      }

      if (!node.data) {
        console.log('No node data', node);
        return;
      }

      const id = node.data.node.id as string;
      const foundNode = flowDefinition.nodes[id];

      if (
        foundNode &&
        (!foundNode.position ||
          foundNode.position.x !== node.position.x ||
          foundNode.position.y !== node.position.y)
      ) {
        doNodeUpdates({
          op: 'update',
          node: {
            ...foundNode,
            position: {
              x: node.position.x,
              y: node.position.y,
              width: foundNode.position?.width as number,
              height: foundNode.position?.height as number,
            },
          },
        });
      }
    },
    [doNodeUpdates, flowDefinition]
  );

  const updateDimensions = useMemo(
    () =>
      debounce((dimensionChanges: NodeDimensionChange[]) => {
        if (!flowDefinition) {
          return;
        }

        const nextNodes = dimensionChanges.map((change) => {
          const nextNode = flowDefinition.nodes[change.id];
          const update: NodeOp = {
            op: 'update',
            node: {
              ...nextNode,
              position: {
                x: nextNode.position?.x as number,
                y: nextNode.position?.y as number,
                width: change.dimensions?.width as number,
                height: change.dimensions?.height as number,
              },
            },
          };
          return update;
        });

        doNodeUpdates(nextNodes);
      }, 300),
    [doNodeUpdates, flowDefinition]
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const dimensionChanges: NodeDimensionChange[] = [];
      changes.forEach((change) => {
        if (change.type === 'dimensions' && change.resizing) {
          dimensionChanges.push(change);
        }
      });
      if (dimensionChanges.length > 0) {
        updateDimensions(dimensionChanges);
      }
      onNodesChange(changes);
    },
    [onNodesChange, updateDimensions]
  );

  const onNodeClick = useCallback(
    (event: any, node: LocalFlowNode) => {
      setSelectedNodeId(node.data.node.id || null);
      setSelectedEdgeId(null);
      // updateCreatingEdge(null);
    },
    [setSelectedNodeId, setSelectedEdgeId]
  );

  const onEdgeClick = useCallback(
    (e: any, edge: EdgeWithData) => {
      setSelectedNodeId(null);
      setSelectedLeafNodeId(null);
      setSelectedBranchOptionId(null);
      setSelectedEdgeId(edge.id);
      updateCreatingEdge(null);
    },
    [setSelectedNodeId, setSelectedLeafNodeId, setSelectedEdgeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedLeafNodeId(null);
    setSelectedBranchOptionId(null);
    setSelectedEdgeId(null);
    updateCreatingEdge(null);
  }, [setSelectedNodeId, setSelectedLeafNodeId, setSelectedEdgeId]);

  // When moving multiple nodes at once
  const handleSelectionDragStop = useCallback(
    (e: any, nodes: LocalFlowNode[]) => {
      const updates = compact(
        nodes.map((flowNode) => {
          const { node } = flowNode.data;
          if (!node.position) {
            return null;
          }
          const update: NodeOp = {
            op: 'update',
            node: {
              ...node,
              position: {
                ...node.position,
                x: flowNode.position?.x as number,
                y: flowNode.position?.y as number,
              },
            },
          };
          return update;
        })
      );
      doNodeUpdates(updates);
    },
    [doNodeUpdates]
  );

  useEffect(() => {
    let x = 0;
    let y = 0;

    const handleCopyEvent = () => {
      const selection = window.getSelection();

      // Clear out copyPaste selection if text is selected
      if (
        !selectedNodesAndEdges &&
        selection &&
        selection.anchorOffset !== selection.focusOffset
      ) {
        console.log('Text is selected');
        setFlowCopyPasteState(null);
        return;
      }

      // Group of selected nodes
      if (selectedNodesAndEdges) {
        const newNodes: Record<string, IFlowDefinitionNode> = {};
        selectedNodesAndEdges.nodes.forEach((n) => {
          newNodes[n.id] = n.data.node;
        });

        setFlowCopyPasteState(newNodes);
      } else if (selectedNodeId && flowDefinition?.nodes[selectedNodeId]) {
        setFlowCopyPasteState({
          [selectedNodeId]: flowDefinition.nodes[selectedNodeId],
        });
      }
    };

    const handlePasteEvent = (event: ClipboardEvent) => {
      if (
        !flowCopyPasteState ||
        !reactFlowWrapper.current ||
        !reactFlowInstance
      ) {
        return;
      }

      const rect = reactFlowWrapper.current.getBoundingClientRect();
      const pos = reactFlowInstance.project({ x: x - rect.x, y: y - rect.y });

      // let newNodes: Record<string, IFlowDefinitionNode> = {}
      const updates: NodeOp[] = [];
      const updateCopyState = cloneCopyPasteState(flowCopyPasteState, pos);

      Object.values(updateCopyState).forEach((node) => {
        updates.push({
          op: 'update',
          node: node,
        });
      });

      doNodeUpdates(updates);

      console.log('Paste event detected', pos);

      console.log(flowCopyPasteState);
    };

    const handleMouseMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
    };

    document.addEventListener('copy', handleCopyEvent);
    document.addEventListener('paste', handlePasteEvent);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('copy', handleCopyEvent);
      document.removeEventListener('paste', handlePasteEvent);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    selectedNodeId,
    flowCopyPasteState,
    flowDefinition,
    doNodeUpdates,
    selectedNodesAndEdges,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === 'z' && event.ctrlKey && event.shiftKey) ||
        (event.key === 'z' && event.metaKey && event.shiftKey)
      ) {
        redoFlowDefOperation();
      } else if (
        (event.key === 'z' && event.ctrlKey) ||
        (event.key === 'z' && event.metaKey)
      ) {
        undoFlowDefOperation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undoFlowDefOperation, redoFlowDefOperation]);

  // const handleSelectionEnd = useCallback(() => {return}, []);

  let backgroundGap = 30;
  if (zoom < 0.4) {
    backgroundGap = 60;
  }
  if (zoom <= 0.2) {
    backgroundGap = 120;
  }

  return (
    <Box
      id="flow-diag-parent"
      sx={{
        height: '100%',
        position: 'relative',
        background: 'rgb(252,252,252)',
      }}
      ref={drop}
    >
      <Box sx={{ height: '100%' }} ref={reactFlowWrapper}>
        <FlowDiagramContext.Provider
          value={{
            selectedNodeId: selectedNodeId,
            creatingEdge,
            updateCreatingEdge,
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgeClick={onEdgeClick}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onConnect={onConnect}
            nodeTypes={flowDiagramNodeTypes}
            onNodeDragStop={onNodeDragStop}
            onSelectionDragStop={handleSelectionDragStop}
            // onSelectionEnd={handleSelectionEnd}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            connectionMode={ConnectionMode.Loose}
            connectionLineType={ConnectionLineType.SmoothStep}
            connectionLineComponent={CustomConnectionLine}
            edgeUpdaterRadius={20}
            panOnScroll
            panOnDrag
            // panOnDrag={false}
            maxZoom={2}
            minZoom={0.1}
            // selectNodesOnDrag={false}
            // onEdgeUpdaterMouseEnter={(e) => {

            // }}
            // onConnectStart={onConnectStart}
            // onConnectEnd={onConnectEnd}
            edgeTypes={flowDiagramEdgesTypes}
            // snapToGrid
            fitView
          >
            {/* <Background
              color="rgb(225,225,225)"
              // color="#E3F2FD"
              // color="#BBDEFB"
              gap={32}
              size={3}
              variant={BackgroundVariant.Cross}
            /> */}
            <Controls />
            <Background
              id="1"
              gap={backgroundGap}
              // color="rgba(227,242,253, 0.5)"
              color="rgb(245,245,245)"
              variant={BackgroundVariant.Lines}
            />
            <Background
              id="2"
              gap={backgroundGap * 5}
              color="rgb(240,240,240)"
              // color="#E1F5FE"
              variant={BackgroundVariant.Lines}
            />
          </ReactFlow>
        </FlowDiagramContext.Provider>
      </Box>
      {/* <FlowDiagramDrawCanvas onDrawBox={onDrawBox} /> */}
    </Box>
  );
}
