import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from 'reactflow';
import {
  flowDiagramNodeTypes,
  NODE_DEFAULT_HEIGHT,
  NODE_DEFAULT_WIDTH,
} from '@cqlab/ui-flow-diagram';
import {
  IFlowDefinitionNode,
  DefinitionNodeTypeEnum,
} from '@cqlab/cqflow-core';
import { cloneDeep } from 'lodash';
// import dagre from 'dagre';

export const measureDiagramNodes = (
  nodes: Record<string, IFlowDefinitionNode>,
  callback: (graphData: Record<string, IFlowDefinitionNode>) => void
) => {
  const SOME_ID = '833hsg';

  const nextNodes = cloneDeep(nodes);

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);

  const els = Object.values(nodes).map((node: any, index: number) => {
    const Klass = flowDiagramNodeTypes[
      node.nodeType as DefinitionNodeTypeEnum
    ] as any;

    if (!Klass) {
      return null;
    }

    return (
      <div
        key={node.id}
        id={`${SOME_ID}-${index}`}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          width: NODE_DEFAULT_WIDTH,
        }}
      >
        {/* @ts-: */}

        <Klass data={node} isConnectable={false} />
      </div>
    );
  });

  root.render(<ReactFlowProvider>{els}</ReactFlowProvider>);

  setTimeout(() => {
    Object.keys(nextNodes).map((key, index) => {
      const node = nextNodes[key];
      const foundEl = document.getElementById(`${SOME_ID}-${index}`);

      const height = foundEl ? foundEl.clientHeight * 1.2 : NODE_DEFAULT_HEIGHT;

      return {
        ...node,
        position: {
          ...node.position,
          height: height,
        },
        style: {
          width: NODE_DEFAULT_WIDTH,
          height: height,
        },
        // data: {
        //   ...node.data,
        //   // height:  foundEl?.clientHeight
        //   height: foundEl ? foundEl.clientHeight * 1.2 : node.data.height,
        // },
      };
    });

    root.unmount();

    return callback(nextNodes);
    // return callback([
    //   ...reactflowNodes,
    //   ...nodes,
    // ]);
  }, 200);
};

export const getLayoutedElements = (
  nodes: any,
  edges: any,
  direction = 'TB'
) => {
  /**
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: 'TB',
    ranker: 'longest-path',
    // ranker: 'tight-tree',
    edgesep: 250,
  });

  nodes.forEach((node: any) => {
    let width =
      node.data?.position?.width || node.style.width || NODE_DEFAULT_WIDTH;
    let height =
      node.data?.position?.height || node.style.height || NODE_DEFAULT_HEIGHT;

    const { nodeType } = node.data.node;

    if (nodeType === 'TrueFalse') {
      width = width * 2;
      height = height * 1.6;
    }

    // console.log('erer', nodeType)

    dagreGraph.setNode(node.id, {
      width: width,
      height: height,
    });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const nextNodes = nodes.map((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'top';
    node.sourcePosition = 'bottom';

    return {
      ...node,
      position: {
        x:
          nodeWithPosition.x -
          (node.data?.position?.width || NODE_DEFAULT_WIDTH) / 2,
        y:
          nodeWithPosition.y -
          (node.data?.position?.height || NODE_DEFAULT_HEIGHT) / 2,
      },
    };
  });


  return { nodes: nextNodes, edges };
 */
};
