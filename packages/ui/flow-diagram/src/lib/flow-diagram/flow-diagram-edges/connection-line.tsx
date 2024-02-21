import {
  ConnectionLineComponentProps,
  Position,
  getStraightPath,
} from 'reactflow';
import { getPossibleHandles, getClosestCoord } from './edge-utils';
import { ViewFlowNode } from '../convert-nodes-and-edges';
// import {
//   getSmartEdge,
//   svgDrawStraightLinePath,
//   svgDrawSmoothLinePath,
//   pathfindingJumpPointNoDiagonal,
//   pathfindingAStarDiagonal,
// } from '@tisoap/react-flow-smart-edge';
import {
  useStore,
  EdgeProps,
  useNodes,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getBezierPath,
} from 'reactflow';

export function CustomConnectionLine(props: ConnectionLineComponentProps) {
  const {
    fromX,
    fromY,
    fromPosition,
    toX,
    toY,
    toPosition,
    connectionLineType,
    connectionLineStyle,
    fromNode,
    fromHandle,
    ...rest
  } = props;
  const res = getPossibleHandles(fromNode as ViewFlowNode<any>);

  // let calcSourceX = fromX;
  // let calcSourceY = fromY;

  // This calculates the closest handle to the target when starting from the toolbar
  // const isToolbar = fromHandle?.id?.startsWith('toolbar');

  // if (isToolbar) {
  //   const closest = getClosestCoord(
  //     {
  //       x: toX,
  //       y: toY,
  //       position: toPosition,
  //     },
  //     Object.values(res)
  //   );

  //   calcSourceX = closest.x;
  //   calcSourceY = closest.y;
  // }

  const [path] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  if (path === null) {
    return null;
  }

  return (
    <BaseEdge
      path={path}
      // markerEnd={markerEnd}
      style={{ strokeWidth: 3 }}
      // interactionWidth={10}
    />
  );
}
