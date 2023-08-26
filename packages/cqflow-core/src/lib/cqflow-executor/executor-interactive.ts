import { compileNodes } from './utils';
import { IFlowDefintion } from '../cqflow-definition/cqflow-definition';
import { InteractiveFlowContext } from '../cqflow-context/interactive-flow-context';
import { InteractiveFlowImplementation } from '../cqflow-implementation/interactive-flow-implementation';
import {
  ImplementationNodeTypeEnum,
  TernaryEnum,
  AnswerTypeEnum,
} from '../enums';
import {
  FlowStepAnswer,
  IActionAnswer,
  IIndexAnswer,
  IYesNoAnswer,
} from '../cqflow-steps/answers';
import {
  ExecNode,
  EmitDataNode,
  StartNode,
  EndNode,
  SubFlowNode,
  MessageNode,
  NarrativeNode,
  BaseNode,
  YesNoNode,
} from '../cqflow-nodes';
import {
  FlowStep,
  StartStep,
  ExecStep,
  EndStep,
  EmitDataStep,
  MessageStep,
  NarrativeStep,
  YesNoStep,
} from '../cqflow-steps';
import {
  executeStartNode,
  executeEndNode,
  executeEmitDataNode,
} from './executor-non-interactive';

// type FlowContext = FlowContext;

export interface SubFlowExecution<C extends InteractiveFlowContext> {
  flowImplementation: InteractiveFlowImplementation;
  flowDefinition: IFlowDefintion;
}

interface ReturnStep {
  step: FlowStep;
  nextNodeId: string | null;
}

export async function executeInteractiveFlow(
  flowImplementation: InteractiveFlowImplementation,
  context: InteractiveFlowContext,
  subFlows: null | Record<string, SubFlowExecution<InteractiveFlowContext>> = {}
): Promise<FlowStep[]> {
  const steps: FlowStep[] = [];

  const currentAnswers = context.getMergedAnswers();

  const nodes = compileNodes(flowImplementation, context.getFlowDefinition());

  const startNode = Object.values(nodes).find(
    (node) => node instanceof StartNode
  );

  if (startNode) {
    await recurseInteractiveFlow(
      startNode.getDefinitionId(),
      nodes,
      context,
      steps
    );
  }

  return steps;
}

export async function recurseInteractiveFlow(
  nodeId: string | null,
  nodes: Record<string, BaseNode>,
  context: InteractiveFlowContext,
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
  } else if (node instanceof YesNoNode) {
    nextStep = await executeInteractiveYesNoNode(node, context);
  } else if (node instanceof ExecNode) {
    nextStep = await executeInteractiveExecNode(node, context);
  } else if (node instanceof EmitDataNode) {
    nextStep = await executeEmitDataNode(node, context);
  }

  if (!nextStep) {
    throw new Error(`Executor can not be found for nodeType: ${node.nodeType}`);
  }

  steps.push(nextStep.step);
  await recurseInteractiveFlow(nextStep.nextNodeId, nodes, context, steps);
}

export async function executeInteractiveYesNoNode(
  node: YesNoNode,
  context: InteractiveFlowContext
): Promise<ReturnStep> {
  const step: YesNoStep = {
    stepType: ImplementationNodeTypeEnum.YesNo,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    answer: null,
  };

  const answers = context.getMergedAnswers();

  step.answer = (answers[step.stepId] as IYesNoAnswer) || null;

  let nextNodeId = null;

  if (step.answer?.value === TernaryEnum.TRUE) {
    nextNodeId = node.getOnTrueId();
  } else if (step.answer?.value === TernaryEnum.FALSE) {
    nextNodeId = node.getOnFalseId();
  }

  return { step, nextNodeId };
}

export async function executeInteractiveExecNode(
  node: ExecNode,
  context: InteractiveFlowContext
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

  const answers = context.getMergedAnswers();

  step.answer = (answers[step.stepId] as IYesNoAnswer) || null;

  let nextNodeId = null;

  // First check evaluation, then check answer
  if (step.evaluation === TernaryEnum.TRUE) {
    nextNodeId = node.getOnTrueId();
  } else if (step.evaluation === TernaryEnum.FALSE) {
    nextNodeId = node.getOnFalseId();
  } else if (step.answer?.value === TernaryEnum.TRUE) {
    nextNodeId = node.getOnTrueId();
  } else if (step.answer?.value === TernaryEnum.FALSE) {
    nextNodeId = node.getOnFalseId();
  }

  return { step, nextNodeId };
}
