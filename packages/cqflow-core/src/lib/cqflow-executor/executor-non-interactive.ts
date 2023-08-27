import { compileNodes } from './utils';
import { IFlowDefintion } from '../cqflow-definition/cqflow-definition';
import { FlowContext } from '../cqflow-context/cqflow-context';
import { NonInteractiveFlowImplementation } from '../cqflow-implementation/non-interactive-flow-implementation';
import {
  ExecNode,
  EmitDataNode,
  StartNode,
  EndNode,
  SubFlowNode,
  MessageNode,
  NarrativeNode,
  BaseNode,
} from '../cqflow-nodes';
import {
  FlowStep,
  StartStep,
  ExecStep,
  EndStep,
  EmitDataStep,
  MessageStep,
  NarrativeStep,
} from '../cqflow-steps';
import { ImplementationNodeTypeEnum, TernaryEnum } from '../enums';

// type FlowContext = FlowContext;

interface SubFlowExecution<C extends FlowContext> {
  flowImplementation: NonInteractiveFlowImplementation;
  flowDefinition: IFlowDefintion;
}

interface ReturnStep {
  step: FlowStep;
  nextNodeId: string | null;
}

export async function executeNonInteractiveFlow(
  flowImplementation: NonInteractiveFlowImplementation,
  context: FlowContext,
  subFlows: null | Record<string, SubFlowExecution<FlowContext>> = {}
): Promise<FlowStep[]> {
  const steps: FlowStep[] = [];

  const nodes = compileNodes(flowImplementation, context.getFlowDefinition());

  const startNode = Object.values(nodes).find(
    (node) => node instanceof StartNode
  );

  if (startNode) {
    await recurseNonInteractiveFlow(
      startNode.getDefinitionId(),
      nodes,
      context,
      steps
    );
  }

  return steps;
}

export async function recurseNonInteractiveFlow(
  nodeId: string | null,
  nodes: Record<string, BaseNode>,
  context: FlowContext,
  steps: FlowStep[]
) {
  if (!nodeId || !nodes[nodeId]) {
    return;
  }

  const node = nodes[nodeId];

  let nextStep: ReturnStep | null = null;

  if (node instanceof StartNode) {
    nextStep = await executeStartNode(node, context);
  } else if (node instanceof EndNode) {
    nextStep = await executeEndNode(node, context);
  } else if (node instanceof ExecNode) {
    nextStep = await executeExecNode(node, context);
  } else if (node instanceof EmitDataNode) {
    nextStep = await executeEmitDataNode(node, context);
  }

  if (!nextStep) {
    throw new Error(`Executor can not be found for nodeType: ${node.nodeType}`);
  }

  steps.push(nextStep.step);
  await recurseNonInteractiveFlow(nextStep.nextNodeId, nodes, context, steps);
}

export async function executeStartNode(
  node: StartNode,
  context: FlowContext
): Promise<ReturnStep> {
  const step: StartStep = {
    stepType: ImplementationNodeTypeEnum.Start,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    initialData: context.getInitialData(),
    label: await node.getLabel(context),
  };

  return { step, nextNodeId: node.getNextNodeId() };
}

export async function executeEndNode(
  node: EndNode,
  context: FlowContext
): Promise<ReturnStep> {
  const step: EndStep = {
    stepType: ImplementationNodeTypeEnum.End,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
  };

  return { step, nextNodeId: null };
}

export async function executeExecNode(
  node: ExecNode,
  context: FlowContext
): Promise<ReturnStep> {
  const step: ExecStep = {
    stepType: ImplementationNodeTypeEnum.Exec,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    evaluation: await node.evaluate(context),
    supplementalData: await node.resolveSupplementalData(context),
  };

  // Both UKNOWN and FALSE go to false path
  const nextNodeId =
    step.evaluation === TernaryEnum.TRUE
      ? node.getOnTrueId()
      : node.getOnFalseId();

  return { step, nextNodeId };
}

export async function executeEmitDataNode(
  node: EmitDataNode<FlowContext, any>,
  context: FlowContext
): Promise<ReturnStep> {
  const step: EmitDataStep = {
    stepType: ImplementationNodeTypeEnum.EmitData,
    stepId: node.getDefinitionId(),
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    contextData: await node.getContextData(context),
  };

  for (const d of step.contextData) {
    context.addToContextDataStack(node.getDefinitionId(), d);
  }

  return { step, nextNodeId: node.getNextNodeId() };
}

// async function recurseNode(
//   nodeId: string | null,
//   // currentFlowDefinitionId: string
// ) {
//   if (!nodeId || !nodes[nodeId]) {
//     return;
//   }

//   const node = nodes[nodeId];

//   let nextStep: ReturnStep | null = null

//   if (node instanceof StartNode) {
//     nextStep = await executeStartNode(node, context);
//   } else if (node instanceof EndNode) {
//     nextStep = await executeEndNode(node, context);
//   } else if (node instanceof ExecNode) {
//     nextStep = await executeExecNode(node, context);
//   } else if (node instanceof EmitDataNode) {
//     nextStep = await executeEmitDataNode(node, context);
//   }

//   if (!nextStep) {
//     throw new Error(`Executor can not be found for: '${node}`)
//   }

//   steps.push(nextStep.step);
//   await recurseNode(nextStep.nextNodeId);

//   /**
//   else if (node instanceof StartNode) {
//     const step: StartStep = {
//       ...nextStep,
//       stepType: ImplementationNodeTypeEnum.Start,
//       initialData: context.getInitialData(),
//     };

//     steps.push(step);
//     await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
//   } else if (node instanceof EndNode) {
//     const step: EndStep = {
//       ...nextStep,
//       stepType: ImplementationNodeTypeEnum.End,
//     };

//     steps.push(step);
//   } else if (node instanceof MessageNode) {
//     const step: MessageStep = {
//       ...nextStep,
//       stepType: ImplementationNodeTypeEnum.Message,
//       label: node.getLabel(context),
//     };

//     steps.push(step);
//     await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
//   } else if (node instanceof NarrativeNode) {
//     const step: NarrativeStep = {
//       ...nextStep,
//       stepType: ImplementationNodeTypeEnum.Narrative,
//       label: node.getLabel(context),
//       narrative: node.getLabel(context) || '',
//     };

//     steps.push(step);
//     await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
//   } else if (node instanceof ExecNode) {
//     const step: ExecStep = {
//       ...nextStep,
//       label: node.getLabel(context),
//       stepType: ImplementationNodeTypeEnum.Exec,
//       evaluation: TernaryEnum.UNKNOWN,
//       answer: null,
//       supplementalData: await node.resolveSupplementalData(context),
//     };

//     step.evaluation = await node.evaluate(context);

//     steps.push(step);

//     if (step.evaluation === TernaryEnum.TRUE) {
//       await recurseNode(node.getOnTrueId(), currentFlowDefinitionId);
//     } else {
//       await recurseNode(node.getOnFalseId(), currentFlowDefinitionId);
//     }
//   } else if (node instanceof EmitDataNode) {
//     const step: EmitDataStep = {
//       ...nextStep,
//       stepType: ImplementationNodeTypeEnum.EmitData,
//       label: await node.getLabel(context),
//       contextData: await node.getContextData(context),
//     };

//     for (const d of step.contextData) {
//       context.addToContextDataStack(nodeId, d);
//     }

//     // node.addDataToContext(context)

//     // const hook = node.getHook()
//     // if (hook) {
//     //   hook(context);
//     // }

//     steps.push(step);

//     await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
//   } else if (node instanceof SubFlowNode) {
//     const subFlowId = node.getSubFlowId();

//     if (!subFlows || !subFlows[subFlowId as string]) {
//       throw new Error(`Subflow ${node.getDefinitionId()} not found`);
//     }

//     const {
//       flowImplementation: subFlowImplementation,
//       flowDefinition: subFlowDefinition,
//     } = subFlows[subFlowId as string];

//     // Get if it exists, else pass current context
//     const subFlowContext = node.getSubFlowContext(context);

//     const subResults = await executeNonInteractiveFlow(
//       subFlowImplementation,
//       subFlowContext || context,
//       subFlows
//     );

//     steps.push(...subResults);

//     await recurseNode(node.getNextNodeId(), subFlowDefinition.id);
//   }
//    */
// }
