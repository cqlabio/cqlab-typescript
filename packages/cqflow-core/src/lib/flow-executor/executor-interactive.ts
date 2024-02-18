import { compileNodes } from './compile-nodes';
import { compact } from 'lodash';
import { IFlowDefinition, INumberField } from '../flow-definition';
import { InteractiveFlowContext } from '../flow-context/interactive-flow-context';
import { InteractiveFlowImplementation } from '../flow-implementation/interactive-flow-implementation';
import {
  ImplementationNodeTypeEnum,
  TernaryEnum,
  AnswerTypeEnum,
  ActionStatusEnum,
} from '../enums';
import {
  IFlowStepAnswer,
  ICustomDataAnswer,
  IYesNoAnswer,
  IOptionAnswer,
  ITextAnswer,
  INumberAnswer,
  IActionAnswer,
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
  BranchExecNode,
  ActionDummyNode,
  SubFlowNode,
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
  IMultiOptionStep,
  IActionStep,
} from '../flow-steps';
import {
  executeStartNode,
  executeEndNode,
  executeEmitDataNode,
  executeNarrativeNode,
} from './executor-non-interactive';
import { IMultiOptionAnswer } from '../flow-steps/answers';
import { MultiOptionExecNode } from '../flow-nodes/multi-option-node';

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
  } else if (node instanceof MultiOptionExecNode) {
    nextStep = await executeInteractiveMultiOptionExecNode(
      node,
      context,
      answers
    );
  } else if (node instanceof BranchChoiceNode) {
    nextStep = await executeInteractiveBranchChoiceNode(node, context, answers);
  } else if (node instanceof BranchExecNode) {
    nextStep = await executeInteractiveBranchExecNode(node, context, answers);
  } else if (node instanceof ActionDummyNode) {
    nextStep = await executeInteractiveActionDummyNode(node, context, answers);
  } else if (node instanceof CustomFormNode) {
    nextStep = await executeInteractiveCustomFormNode(node, context, answers);
  } else if (node instanceof MultiOptionFieldNode) {
    nextStep = await executeInteractiveOptionFieldNode(node, context, answers);
  } else if (node instanceof TextFieldNode) {
    nextStep = await executeInteractiveTextFieldNode(node, context, answers);
  } else if (node instanceof NumberFieldNode) {
    nextStep = await executeInteractiveNumberFieldNode(node, context, answers);
  }

  // else if (node instanceof SubFlowNode) {
  //   nextStep = await executeInteractiveSubFlowNode(node, context, answers);

  // }

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

export async function executeInteractiveMultiOptionExecNode(
  node: MultiOptionExecNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: IMultiOptionStep = {
    stepType: ImplementationNodeTypeEnum.MultiOptionExec,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    options: node.getOptions(),
    evaluation: null,
    answer: null,
  };

  // TODO: this should not be undefined
  step.answer = answers[step.stepId] as IMultiOptionAnswer | null;

  let nextNodeId = null;
  if (step.answer) {
    if (step.answer.selectedIds.length >= step.nodeDefinition.min) {
      nextNodeId = node.getOnTrueId();
    } else {
      nextNodeId = node.getOnFalseId();
    }
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
    evaluation: null,
  };

  step.answer = answers[step.stepId] as IOptionAnswer | null;

  let nextNodeId = null;
  if (step.answer?.selectedId) {
    const option = step.options.find((o) => o.id === step.answer?.selectedId);
    nextNodeId = option?.toId || null;
  }

  return { step, nextNodeId };
}

export async function executeInteractiveBranchExecNode(
  node: BranchExecNode,
  // nodes:  Record<string, BaseNode>,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
) {
  const step: IBranchChoiceStep = {
    stepType: ImplementationNodeTypeEnum.BranchChoice,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    options: node.getOptions(),
    answer: null,
    evaluation: null,
  };

  const optionResults: TernaryEnum[] = [];

  // Find the first true evaluation if any
  for (const option of step.options) {
    if (step.evaluation) {
      break;
    }

    const branchOptionExec = node.getBranchOptionExec(option.bindId);

    if (branchOptionExec) {
      const result = await branchOptionExec.evaluate(context);
      if (result === TernaryEnum.TRUE) {
        step.evaluation = {
          answerType: AnswerTypeEnum.SingleOption,
          selectedId: option.id,
        };
      }
      optionResults.push(result);
    } else {
      optionResults.push(TernaryEnum.UNKNOWN);
    }
  }

  if (step.evaluation) {
    step.options = step.options.filter(
      (option) => option.id === step.evaluation?.selectedId
    );
  } else {
    // Remove all the false nodes as possible options
    step.options = compact(
      step.options.map((option, index) => {
        if (optionResults[index] === TernaryEnum.FALSE) {
          return null;
        }
        return option;
      })
    );

    // If there is only one option left, auto-answer it
    if (step.options.length === 1) {
      step.evaluation = {
        answerType: AnswerTypeEnum.SingleOption,
        selectedId: step.options[0].id,
      };
    }
  }

  if (!step.evaluation) {
    step.answer = answers[step.stepId] as IOptionAnswer | null;
  }

  let nextNodeId = null;

  if (step.evaluation?.selectedId) {
    const option = step.options.find(
      (o) => o.id === step.evaluation?.selectedId
    );
    nextNodeId = option?.toId || null;
  } else if (step.answer?.selectedId) {
    const option = step.options.find((o) => o.id === step.answer?.selectedId);
    nextNodeId = option?.toId || null;
  }

  return { step, nextNodeId };
}

export async function executeInteractiveActionDummyNode(
  node: ActionDummyNode,
  context: InteractiveFlowContext,
  answers: Record<string, IFlowStepAnswer>
): Promise<ReturnStep> {
  const step: IActionStep = {
    stepType: ImplementationNodeTypeEnum.Action,
    stepId: node.getDefinition().id,
    flowDefinitionId: context.getFlowDefinition().id,
    nodeDefinition: node.getDefinition(),
    label: await node.getLabel(context),
    answer: null,
    statuses: {},
  };

  step.answer = answers[step.stepId] as IActionAnswer | null;

  let nextNodeId = null;
  if (step.answer) {
    node.getActions().forEach((action) => {
      const found = step.answer?.submitted.find(
        (actionId) => actionId === action.id
      );
      if (found) {
        step.statuses[action.id] = ActionStatusEnum.Success;
      } else {
        step.statuses[action.id] = ActionStatusEnum.NotTaken;
      }
    });

    nextNodeId = node.getNextNodeId();
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
    evaluation: null,
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

// export async function executeInteractiveSubFlowNode(
//   node: SubFlowNode<any>,
//   context: InteractiveFlowContext,
//   answers: Record<string, IFlowStepAnswer>
// ): Promise<ReturnStep> {

//   const subflowContext = await node.getSubFlowContext(context);

//   const subflowNodes = compileNodes(flowImplementation, context.getFlowDefinition());

//   recurseInteractiveFlow()

//   const step: IExecStep = {
//     stepType: ImplementationNodeTypeEnum.Exec,
//     stepId: node.getDefinition().id,
//     flowDefinitionId: context.getFlowDefinition().id,
//     nodeDefinition: node.getDefinition(),
//     label: await node.getLabel(context),
//     evaluation: TernaryEnum.TRUE,
//     supplementalData: await node.resolveSupplementalData(context),
//   };

//   const subFlowId = node.getDefinition().subFlowId;
//   const subFlow = context.getSubFlow(subFlowId);

//   if (!subFlow) {
//     throw new Error(`SubFlow with id ${subFlowId} not found`);
//   }

//   const subFlowContext = context.createSubFlowContext(subFlowId);

//   const subFlowImplementation = new InteractiveFlowImplementation();
//   const subFlowSteps = await executeInteractiveFlow(
//     subFlowImplementation,
//     subFlowContext
//   );

//   subFlowSteps.forEach((step) => {
//     context.addFlowStep(step);
//   });

//   const nextNodeId = node.getNextNodeId();

//   return { step, nextNodeId };
// }
