import { compileNodes } from './utils';
import { IFlowDefinition } from '../flow-definition';
import { InteractiveFlowContext } from '../flow-context/interactive-flow-context';
import { InteractiveFlowImplementation } from '../flow-implementation/interactive-flow-implementation';
import {
  ImplementationNodeTypeEnum,
  TernaryEnum,
  AnswerTypeEnum,
} from '../enums';
import {
  IFlowStepAnswer,
  ICustomDataAnswer,
  IYesNoAnswer,
  IOptionAnswer,
} from '../flow-steps/answers';
import {
  ExecNode,
  EmitDataNode,
  StartNode,
  EndNode,
  NarrativeNode,
  BaseNode,
  YesNoNode,
  CustomDataInputNode,
  OptionSelectNode,
  BranchChoiceNode,
} from '../flow-nodes';
import {
  IFlowStep,
  IExecStep,
  IYesNoStep,
  ICustomDataInputStep,
  IOptionSelectStep,
  IBranchChoiceStep,
} from '../flow-steps';
import {
  executeStartNode,
  executeEndNode,
  executeEmitDataNode,
  executeNarrativeNode,
} from './executor-non-interactive';
import { IMultiOptionAnswer } from '../flow-steps/answers/multi-option-answer';

// type FlowContext = FlowContext;

export interface SubFlowExecution<C extends InteractiveFlowContext> {
  flowImplementation: InteractiveFlowImplementation;
  flowDefinition: IFlowDefinition;
}

interface ReturnStep {
  step: IFlowStep;
  nextNodeId: string | null;
}

export async function executeInteractiveFlow(
  flowImplementation: InteractiveFlowImplementation,
  context: InteractiveFlowContext,
  subFlows: null | Record<string, SubFlowExecution<InteractiveFlowContext>> = {}
): Promise<IFlowStep[]> {
  const steps: IFlowStep[] = [];

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
      steps,
      currentAnswers
    );
  }

  return steps;
}

export async function recurseInteractiveFlow(
  nodeId: string | null,
  nodes: Record<string, BaseNode>,
  context: InteractiveFlowContext,
  steps: IFlowStep[],
  answers: Record<string, IFlowStepAnswer>
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
  } else if (node instanceof NarrativeNode) {
    nextStep = await executeNarrativeNode(node, context);
  } else if (node instanceof EmitDataNode) {
    nextStep = await executeEmitDataNode(node, context);
  } else if (node instanceof YesNoNode) {
    nextStep = await executeInteractiveYesNoNode(node, context, answers);
  } else if (node instanceof ExecNode) {
    nextStep = await executeInteractiveExecNode(node, context, answers);
  } else if (node instanceof BranchChoiceNode) {
    nextStep = await executeInteractiveBranchChoiceNode(node, context, answers);
  } else if (node instanceof OptionSelectNode) {
    nextStep = await executeInteractiveOptionSelectNode(node, context, answers);
  } else if (node instanceof CustomDataInputNode) {
    nextStep = await executeInteractiveCustomInputDataNode(
      node,
      context,
      answers
    );
  }

  if (!nextStep) {
    throw new Error(`Executor can not be found for nodeType: ${node.nodeType}`);
  }

  steps.push(nextStep.step);
  await recurseInteractiveFlow(
    nextStep.nextNodeId,
    nodes,
    context,
    steps,
    answers
  );
}

export async function executeInteractiveYesNoNode(
  node: YesNoNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: IYesNoStep = {
    stepType: ImplementationNodeTypeEnum.YesNo,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    answer: null,
  };

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
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: IExecStep = {
    stepType: ImplementationNodeTypeEnum.Exec,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    evaluation: await node.evaluate(context),
    supplementalData: await node.resolveSupplementalData(context),
  };

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

export async function executeInteractiveBranchChoiceNode(
  node: BranchChoiceNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: IBranchChoiceStep = {
    stepType: ImplementationNodeTypeEnum.BranchChoice,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    options: node.getOptions(),
    answer: null,
  };

  step.answer = answers[step.stepId] as IOptionAnswer | null;

  let nextNodeId = null;
  if (step.answer?.selectedId) {
    const option = step.options.find((o) => o.id === step.answer?.selectedId);
    nextNodeId = option?.toId || null;
  }

  return { step, nextNodeId };
}

export async function executeInteractiveCustomInputDataNode(
  node: CustomDataInputNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: ICustomDataInputStep = {
    stepType: ImplementationNodeTypeEnum.CustomDataInput,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    jsonSchema: node.getValueJsonSchema(),
    answer: null,
  };

  step.answer = (answers[step.stepId] as ICustomDataAnswer) || null;

  let nextNodeId = null;
  if (step.answer) {
    nextNodeId = node.getNextNodeId();
  }
  return { step, nextNodeId };
}

export async function executeInteractiveOptionSelectNode(
  node: OptionSelectNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: IOptionSelectStep = {
    stepType: ImplementationNodeTypeEnum.OptionSelect,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    answer: null,
    // TODO: We may want to allow these to be overwritten by the implementation
    options: node.getOptions(),
    min: node.getDefinition().min,
    max: node.getDefinition().max,
  };

  step.answer = (answers[step.stepId] as IMultiOptionAnswer) || null;

  let nextNodeId = null;
  if (step.answer) {
    nextNodeId = node.getNextNodeId();
  }
  return { step, nextNodeId };
}
