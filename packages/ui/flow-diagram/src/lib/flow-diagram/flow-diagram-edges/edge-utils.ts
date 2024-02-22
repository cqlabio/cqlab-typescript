import { Position, MarkerType, Node } from 'reactflow';
import {
  IFlowDefinitionNode,
  DefinitionNodeTypeEnum,
} from '@cqlab/cqflow-core';
import { ViewFlowNode } from '../convert-nodes-and-edges';

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode: any, targetNode: any) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + w;
  const y1 = targetPosition.y + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
export function getEdgePosition(node: any, intersectionPoint: any) {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

interface XYCoord {
  x: number;
  y: number;
  position: Position;
}

export function getPossibleHandles(
  flowNode: ViewFlowNode<IFlowDefinitionNode>
): Record<Position, XYCoord> {
  const { node } = flowNode.data;

  if (node.nodeType === DefinitionNodeTypeEnum.TrueFalse) {
    const pos = flowNode.position;

    const halfHeight = (flowNode.style?.height as number) / 2;

    const midPointX = pos.x + halfHeight;
    const midPointY = pos.y + halfHeight;

    const diagLen = Math.sqrt(2 * Math.pow(halfHeight, 2));

    return {
      [Position.Top]: {
        x: midPointX,
        y: midPointY - diagLen,
        position: Position.Top,
      },
      [Position.Right]: {
        x: midPointX + diagLen,
        y: midPointY,
        position: Position.Right,
      },
      [Position.Bottom]: {
        x: midPointX,
        y: midPointY + diagLen,
        position: Position.Bottom,
      },
      [Position.Left]: {
        x: midPointX - diagLen,
        y: midPointY,
        position: Position.Left,
      },
    };
  } else if (
    node.nodeType === DefinitionNodeTypeEnum.EmitData ||
    node.nodeType === DefinitionNodeTypeEnum.End ||
    node.nodeType === DefinitionNodeTypeEnum.Start ||
    node.nodeType === DefinitionNodeTypeEnum.LogicTree ||
    node.nodeType === DefinitionNodeTypeEnum.SubFlow ||
    node.nodeType === DefinitionNodeTypeEnum.Action ||
    node.nodeType === DefinitionNodeTypeEnum.CustomForm ||
    node.nodeType === DefinitionNodeTypeEnum.Branch ||
    node.nodeType === DefinitionNodeTypeEnum.Narrative ||
    node.nodeType === DefinitionNodeTypeEnum.FormField ||
    node.nodeType === DefinitionNodeTypeEnum.MultiOption
  ) {
    const pos = flowNode.position;

    const halfHeight = (flowNode.style?.height as number) / 2;
    const halfWidth = (flowNode.style?.width as number) / 2;

    return {
      [Position.Top]: {
        x: pos.x + halfWidth,
        y: pos.y,
        position: Position.Top,
      },
      [Position.Right]: {
        x: pos.x + halfWidth * 2,
        y: pos.y + halfHeight,
        position: Position.Right,
      },
      [Position.Bottom]: {
        x: pos.x + halfWidth,
        y: pos.y + halfHeight * 2,
        position: Position.Bottom,
      },
      [Position.Left]: {
        x: pos.x,
        y: pos.y + halfHeight,
        position: Position.Left,
      },
    };
  }

  throw new Error(`Unknown node type: ${JSON.stringify(node, null, 2)}`);
}

function calculateDistance(p1: XYCoord, p2: XYCoord) {
  const a = p2.x - p1.x;
  const b = p2.y - p1.y;

  return Math.sqrt(a * a + b * b);
}

export function getClosestCoord(position: XYCoord, coords: XYCoord[]): XYCoord {
  let closestCoord: XYCoord | null = null;

  let closest = 100000000;
  coords.forEach((coord) => {
    const distance = calculateDistance(position, coord);
    if (distance < closest) {
      closest = distance;
      closestCoord = coord;
    }
  });

  if (!closestCoord) {
    throw new Error('Unable to find coord');
  }

  return closestCoord;
}

function getResult(sourceCoord: XYCoord, targetCoord: XYCoord) {
  return {
    sx: sourceCoord.x,
    sy: sourceCoord.y,
    tx: targetCoord.x,
    ty: targetCoord.y,
    sourcePosition: sourceCoord.position,
    targetPosition: targetCoord.position,
  };
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(
  sourceNode: ViewFlowNode<IFlowDefinitionNode>,
  targetNode: ViewFlowNode<IFlowDefinitionNode>
) {
  const sourceHandles = getPossibleHandles(sourceNode);
  const targetHandles = getPossibleHandles(targetNode);

  const sourceTopIsAboveTargetTop =
    sourceHandles.top.y < targetHandles.bottom.y;

  // if (sourceNode.data.bindId === 'was_given_birth_dose_of_hep_b') {
  //   console.log('sourceTopIsAboveTargetTop', sourceTopIsAboveTargetTop,  sourceHandles)
  // }

  if (sourceTopIsAboveTargetTop) {
    const targetIsBelowSource = sourceHandles.bottom.y < targetHandles.top.y;

    if (targetIsBelowSource) {
      return getResult(sourceHandles.bottom, targetHandles.top);
    }

    const sourceIsLeftOfTarget = sourceHandles.right.x < targetHandles.left.x;

    if (sourceIsLeftOfTarget) {
      return getResult(sourceHandles.right, targetHandles.left);
    }

    return getResult(sourceHandles.left, targetHandles.right);
    // Target must overlap source on y axis
  } else {
    // source is below target
    const targetIsAboveSource = targetHandles.bottom.y < sourceHandles.top.y;

    if (targetIsAboveSource) {
      return getResult(sourceHandles.top, targetHandles.bottom);
    }

    const sourceIsLeftOfTarget = sourceHandles.right.x < targetHandles.left.x;

    if (sourceIsLeftOfTarget) {
      return getResult(sourceHandles.right, targetHandles.left);
    }

    return getResult(sourceHandles.left, targetHandles.right);

    // source must overlap target on y axis
  }

  // let shortestDifference = Infinity;
  // let shortestResult = {
  //   sx: 0,
  //   sy: 0,
  //   tx: 0,
  //   ty: 0,
  //   sourcePosition: Position.Top,
  //   targetPosition: Position.Top,
  // };

  // sourceHandles.forEach((sourceHandle) => {
  //   targetHandles.forEach((targetHandle) => {
  //     const distanceBetweenPoints = calculateDistance(
  //       sourceHandle,
  //       targetHandle
  //     );

  //     if (distanceBetweenPoints < shortestDifference) {
  //       shortestDifference = distanceBetweenPoints;
  //       shortestResult = {
  //         sx: sourceHandle.x,
  //         sy: sourceHandle.y,
  //         sourcePosition: sourceHandle.position,
  //         tx: targetHandle.x,
  //         ty: targetHandle.y,
  //         targetPosition: targetHandle.position,
  //       };
  //     }
  //   });
  // });

  // return shortestResult;
  // const sourceIntersectionPoint = getNodeIntersection(source, target);
  // const targetIntersectionPoint = getNodeIntersection(target, source);

  // const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  // const targetPos = getEdgePosition(target, targetIntersectionPoint);

  // return {
  //   sx: sourceIntersectionPoint.x,
  //   sy: sourceIntersectionPoint.y,
  //   tx: targetIntersectionPoint.x,
  //   ty: targetIntersectionPoint.y,
  //   // sourcePos,
  //   // targetPos,
  // };
}
