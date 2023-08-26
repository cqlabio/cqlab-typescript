import { InteractiveFlowContext } from '../cqflow-context/interactive-flow-context';
import { compileNodes } from './utils';

import {
  StartNode,
  ExecNode,
  YesNoNode,
  ActionNode,
  EmitDataNode,
  EndNode,
  BranchChoiceNode,
  TextInputNode,
  NarrativeNode,
  CustomDataInputNode,
} from '../cqflow-nodes';
import { IFlowDefintion } from '../cqflow-definition/cqflow-definition';

import {
  FlowStep,
  StartStep,
  ExecStep,
  YesNoStep,
  ActionStep,
  ContextDataStep,
  EndStep,
  TextInputStep,
  NarrativeStep,
  CustomDataInputStep,
} from '../cqflow-steps';
import {
  FlowStepAnswer,
  IActionAnswer,
  IIndexAnswer,
  IYesNoAnswer,
} from '../cqflow-steps/answers';
import { FlowImplementation } from '../cqflow-implementation/flow-implementation';

import {
  AnswerTypeEnum,
  ImplementationNodeTypeEnum,
  TernaryEnum,
  CQFlowExecutorStateEnum,
} from '../enums';
import { BranchChoiceStep } from '../cqflow-steps/branchchoice-step';
import { ActionStatusEnum } from '../enums';
import { ITextAnswer } from '../cqflow-steps/answers/text-answer';
import { ICustomDataAnswer } from '../cqflow-steps/answers/custom-data-answer';

export async function executeInteractiveFlow(
  flowImplementation: FlowImplementation<InteractiveFlowContext<any, any>>,
  context: InteractiveFlowContext<any, any>
): Promise<FlowStep[]> {
  // TODO: is there a better way to give context access to this?
  // context.setFlowDefinition(flowDefinition);

  const nodes = compileNodes(flowImplementation, context.getFlowDefinition());

  const keys = Object.keys(nodes);
  let startNode: StartNode<InteractiveFlowContext<any, any>> | null = null;

  for (const key of keys) {
    if (nodes[key] instanceof StartNode) {
      startNode = nodes[key] as StartNode<InteractiveFlowContext<any, any>>;
    }
  }

  const currentAnswers = context.getMergedAnswers();

  const steps: FlowStep[] = [];

  async function recurseNode(
    nodeId: string | null,
    currentFlowDefinitionId: string
  ) {
    if (!nodeId || !nodes[nodeId]) {
      return;
    }

    const nextStep = {
      nodeId: nodeId,
      flowDefinitionId: currentFlowDefinitionId,
    };

    const node = nodes[nodeId];

    if (node instanceof StartNode) {
      const step: StartStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.Start,
        initialData: context.getInitialData(),
      };

      steps.push(step);
      await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
    } else if (node instanceof EndNode) {
      const step: EndStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.End,
      };

      steps.push(step);
    } else if (node instanceof ExecNode) {
      const step: ExecStep = {
        ...nextStep,
        label: node.getLabel(context),
        stepType: ImplementationNodeTypeEnum.Exec,
        evaluation: TernaryEnum.UNKNOWN,
        answer: null,
        supplementalData: await node.resolveSupplementalData(context),
      };

      step.evaluation = await node.evaluate(context);

      steps.push(step);

      const answer = currentAnswers[nodeId] as IYesNoAnswer | undefined;
      step.answer = answer || null;

      if (answer?.value && answer.value !== TernaryEnum.UNKNOWN) {
        if (answer.value === TernaryEnum.TRUE) {
          await recurseNode(node.getOnTrueId(), currentFlowDefinitionId);
        } else if (answer.value === TernaryEnum.FALSE) {
          await recurseNode(node.getOnFalseId(), currentFlowDefinitionId);
        }
      } else {
        if (step.evaluation === TernaryEnum.TRUE) {
          await recurseNode(node.getOnTrueId(), currentFlowDefinitionId);
        } else if (step.evaluation === TernaryEnum.FALSE) {
          await recurseNode(node.getOnFalseId(), currentFlowDefinitionId);
        }
      }
    } else if (node instanceof YesNoNode) {
      const step: YesNoStep = {
        ...nextStep,
        label: node.getLabel(context),
        stepType: ImplementationNodeTypeEnum.YesNo,
        answer: null,
      };

      steps.push(step);

      const currentAnswer = currentAnswers[nodeId] as IYesNoAnswer | undefined;
      step.answer = currentAnswer || null;

      if (currentAnswer && currentAnswer.answerType === AnswerTypeEnum.YesNo) {
        if (currentAnswer.value === TernaryEnum.TRUE) {
          await recurseNode(node.getOnTrueId(), currentFlowDefinitionId);
        } else if (currentAnswer.value === TernaryEnum.FALSE) {
          await recurseNode(node.getOnFalseId(), currentFlowDefinitionId);
        }
      }
    } else if (node instanceof NarrativeNode) {
      const step: NarrativeStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.Narrative,
        label: node.getLabel(context),
        narrative: node.getLabel(context) || '',
      };

      steps.push(step);
      await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
    } else if (node instanceof EmitDataNode) {
      const step: ContextDataStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.EmitData,
        label: node.getLabel(context),
        contextData: node.getContextData(context),
      };

      for (const d of step.contextData) {
        context.addToContextDataStack(nodeId, d);
      }

      steps.push(step);

      await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
    } else if (node instanceof ActionNode) {
      const step: ActionStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.Action,
        label: node.getLabel(context),
        actionStatus: ActionStatusEnum.NotTaken,
      };

      steps.push(step);

      const answer = currentAnswers[nodeId] as IActionAnswer | undefined;

      if (answer) {
        const wasActionTaken = await context.wasActionTaken(nodeId);
        if (!wasActionTaken) {
          await node.takeAction(context);
          await context.takeAction(nodeId);
        }
        step.actionStatus = ActionStatusEnum.Success;
        await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
      }
    } else if (node instanceof BranchChoiceNode) {
      const step: BranchChoiceStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.BranchChoice,
        label: node.getLabel(context),
        answer: null,
        options: [...node.getOptions()],
      };

      steps.push(step);

      const answer = currentAnswers[nodeId] as IIndexAnswer | undefined;

      step.answer = answer || null;

      if (answer && answer.value !== null) {
        const option = step.options[answer.value];
        await recurseNode(option.id || null, currentFlowDefinitionId);
      }
    } else if (node instanceof TextInputNode) {
      const step: TextInputStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.TextInput,
        label: node.getLabel(context),
        answer: null,
      };

      steps.push(step);

      const answer = currentAnswers[nodeId] as ITextAnswer | undefined;
      step.answer = answer || null;

      if (answer?.value) {
        await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
      }
    } else if (node instanceof CustomDataInputNode) {
      const step: CustomDataInputStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.CustomDataInput,
        label: node.getLabel(context),
        answer: null,
        jsonSchema: node.getValueJsonSchema(),
      };

      steps.push(step);

      const answer = currentAnswers[nodeId] as ICustomDataAnswer | undefined;
      step.answer = answer || null;

      if (answer) {
        await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
      }
    }
  }

  if (startNode) {
    await recurseNode(
      startNode.getDefinitionId(),
      context.getFlowDefinition().id
    );
  }

  return steps;
}

/**
export class CQFlowExecutorStatefulOld {
  nodes: Record<string, BaseNode>;
  context: InteractiveFlowContext<any>;

  constructor(
    cqFlow: InteractiveFlowImplementation<InteractiveFlowContext<any>>,
    context: InteractiveFlowContext<any>
  ) {
    // this.cqFlow = cqFlow;
    this.nodes = cqFlow.compileNodes();
    this.context = context;
  }

  addAnswer(stepId: string, answer: FlowStepAnswer) {
    if (this.context.getState() === CQFlowExecutorStateEnum.Completed) {
      return;
    }

    if (answer.answerType === AnswerTypeEnum.Action && answer.submitted) {
      this.context.addActionTaken(stepId);

      const actionNode = this.nodes[stepId] as ActionNode<any> | null;

      if (actionNode) {
        const executor = actionNode.getExecutor();
        if (executor) {
          executor(this.context);
        }
      }
    }

    this.context.addAnswer(stepId, answer);
  }

  getStartNode(): StartNode | null {
    const keys = Object.keys(this.nodes);

    for (const key of keys) {
      if (this.nodes[key] instanceof StartNode) {
        return this.nodes[key] as StartNode;
      }
    }

    return null;
  }

  getActiveSteps(): FlowStep[] {
    const steps: FlowStep[] = [];
    const startNode = this.getStartNode();
    const currentAnswers = this.context.getMergedAnswers();

    const recurseNode = (node: BaseNode | null) => {
      if (!node) {
        return;
      }

      if (node instanceof StartNode) {
        const step: StartStep = {
          stepType: ImplementationNodeTypeEnum.Start,
          nodeId: node.id,
        };

        steps.push(step);
        recurseNode(node.getNextNode());
      } else if (node instanceof ExecNode) {
        const step: ExecStep = {
          label: node.label,
          stepType: ImplementationNodeTypeEnum.Exec,
          nodeId: node.id,
          evaluation: TernaryEnum.UNKNOWN,
          answer: null,
        };

        const executor = node.getExecutor();
        if (executor) {
          step.evaluation = executor(this.context);
        }

        steps.push(step);

        if (step.evaluation === TernaryEnum.TRUE) {
          recurseNode(node.getOnTrueNode());
        } else {
          recurseNode(node.getOnFalseNode());
        }
      } else if (node instanceof YesNoNode) {
        const step: YesNoStep = {
          label: node.label,
          stepType: ImplementationNodeTypeEnum.YesNo,
          nodeId: node.id,
          answer: null,
        };

        steps.push(step);

        const currentAnswer = currentAnswers[node.id];

        if (
          currentAnswer &&
          currentAnswer.answerType === AnswerTypeEnum.YesNo
        ) {
          if (currentAnswer.value === TernaryEnum.TRUE) {
            recurseNode(node.getOnTrueNode());
          } else if (currentAnswer.value === TernaryEnum.FALSE) {
            recurseNode(node.getOnFalseNode());
          }
        }
      } else if (node instanceof EmitDataNode) {
        const step: ContextDataStep = {
          stepType: ImplementationNodeTypeEnum.ContextData,
          label: node.label,
          nodeId: node.id,
        };

        steps.push(step);

        recurseNode(node.getNextNode());
      } else if (node instanceof ActionNode) {
        const step: ActionStep = {
          stepType: ImplementationNodeTypeEnum.Action,
          label: node.label,
          nodeId: node.id,
        };

        steps.push(step);

        const wasActionTaken = this.context.wasActionTaken(node.id);
        if (wasActionTaken) {
          recurseNode(node.getNextNode());
        }

        // const currentAnswer = currentAnswers[node.id];

        // if (currentAnswer?.value === TernaryEnum.TRUE) {
        //   recurseNode(node.getOnTrueNode());
        // } else if (currentAnswer?.value === TernaryEnum.FALSE) {
        //   recurseNode(node.getOnFalseNode());
        // }
      }
    };

    if (startNode) {
      recurseNode(startNode);
    }

    return steps;
  }
}
 */
