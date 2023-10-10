import { compileNodes } from './utils';
import { IFlowDefinition, INumberField } from '../flow-definition';
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
  ITextAnswer,
  INumberAnswer,
} from '../flow-steps/answers';
import {
  ExecNode,
  EmitDataNode,
  StartNode,
  EndNode,
  NarrativeNode,
  BaseNode,
  YesNoNode,
  CustomFormNode,
  MultiOptionFieldNode,
  BranchChoiceNode,
  TextFieldNode,
  NumberFieldNode,
} from '../flow-nodes';
import {
  IFlowStep,
  IExecStep,
  IYesNoStep,
  ICustomFormStep,
  IMultiOptionFieldStep,
  IBranchChoiceStep,
  ITextFieldStep,
  INumberFieldStep,
} from '../flow-steps';
import {
  executeStartNode,
  executeEndNode,
  executeEmitDataNode,
  executeNarrativeNode,
} from './executor-non-interactive';
import { IMultiOptionAnswer } from '../flow-steps/answers';

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
  // A context should have fresh steps each times its used
  context.clearSteps();

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
      currentAnswers
    );
  }

  return context.getFlowSteps();
}

export async function recurseInteractiveFlow(
  nodeId: string | null,
  nodes: Record<string, BaseNode>,
  context: InteractiveFlowContext,
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
  } else if (node instanceof CustomFormNode) {
    nextStep = await executeInteractiveCustomFormNode(node, context, answers);
  } else if (node instanceof MultiOptionFieldNode) {
    nextStep = await executeInteractiveOptionFieldNode(node, context, answers);
  } else if (node instanceof TextFieldNode) {
    nextStep = await executeInteractiveTextFieldNode(node, context, answers);
  } else if (node instanceof NumberFieldNode) {
    nextStep = await executeInteractiveNumberFieldNode(node, context, answers);
  }

  if (!nextStep) {
    throw new Error(`Executor can not be found for nodeType: ${node.nodeType}`);
  }

  // Add step to the context
  context.addFlowStep(nextStep.step);

  await recurseInteractiveFlow(nextStep.nextNodeId, nodes, context, answers);
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

export async function executeInteractiveCustomFormNode(
  node: CustomFormNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: ICustomFormStep = {
    stepType: ImplementationNodeTypeEnum.CustomForm,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    jsonSchema: node.getValueJsonSchema(),
    answer: null,
  };

  const calculatedValue = await node.getValue(context);

  if (calculatedValue) {
    step.evaluation = {
      answerType: AnswerTypeEnum.CustomData,
      value: calculatedValue,
    };
  } else {
    step.answer = (answers[step.stepId] as ICustomDataAnswer) || null;
  }

  const nextNodeId =
    step.answer || step.evaluation ? node.getNextNodeId() : null;
  return { step, nextNodeId };
}

export async function executeInteractiveOptionFieldNode(
  node: MultiOptionFieldNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: IMultiOptionFieldStep = {
    stepType: ImplementationNodeTypeEnum.MultiOptionField,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    answer: null,
    // TODO: We may want to allow these to be overwritten by the implementation
    options: node.getOptions(),
    min: node.getDefinition().field.min,
    max: node.getDefinition().field.max,
  };

  step.answer = (answers[step.stepId] as IMultiOptionAnswer) || null;

  let nextNodeId = null;
  if (step.answer) {
    nextNodeId = node.getNextNodeId();
  }
  return { step, nextNodeId };
}

export async function executeInteractiveTextFieldNode(
  node: TextFieldNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: ITextFieldStep = {
    stepType: ImplementationNodeTypeEnum.TextField,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
  };

  const calculatedValue = await node.getValue(context);

  if (calculatedValue) {
    step.evaluation = {
      answerType: AnswerTypeEnum.Text,
      value: calculatedValue,
    };
  } else {
    step.answer = (answers[step.stepId] as ITextAnswer) || null;
  }

  const nextNodeId =
    step.evaluation || step.answer ? node.getNextNodeId() : null;

  return { step, nextNodeId };
}

export async function executeInteractiveNumberFieldNode(
  node: NumberFieldNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: INumberFieldStep = {
    stepType: ImplementationNodeTypeEnum.NumberField,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
  };

  const calculatedValue = await node.getValue(context);

  if (calculatedValue) {
    step.evaluation = {
      answerType: AnswerTypeEnum.Number,
      value: calculatedValue,
    };
  } else {
    step.answer = (answers[step.stepId] as INumberAnswer) || null;
  }

  const nextNodeId =
    step.evaluation || step.answer ? node.getNextNodeId() : null;

  return { step, nextNodeId };
}
