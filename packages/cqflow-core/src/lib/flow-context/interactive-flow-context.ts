import { FlowContext } from './flow-context';
import { FlowStepAnswer, IYesNoAnswer } from '../flow-steps/answers';
import { CQFlowExecutorStateEnum, ActionStatusEnum } from '../enums';
import { InteractiveFlowState } from '../flow-executor/interactive-flow-state';
import cloneDeep from 'lodash/cloneDeep';
import { IFlowDefintion } from '../flow-definition/flow-definition';

export interface CQFlowExecutorStatefulAnswer {
  stepId: string;
  answer: FlowStepAnswer;
}

// interface ContextState {
//   id: string;
//   status: CQFlowExecutorStateEnum;
//   answers: CQFlowExecutorStatefulAnswer[];
//   actionsTaken: Record<string, boolean>;
// }

type OnUpdateInteractiveState<I> = (
  interactiveFlowState: InteractiveFlowState<I>
) => Promise<InteractiveFlowState<I>>;

interface ContextStateLoader {
  //   getStatus(): Promise<CQFlowExecutorStateEnum>;
  //   updateStatus(status: CQFlowExecutorStateEnum): Promise<void>;
  //   getAnswers(): Promise<CQFlowExecutorStatefulAnswer[]>;
  //   getActionsTaken(): Promise<Record<string, ActionStatusEnum>>;
  //   takeAction(nodeId: string): Promise<void>;

  getInteractiveFlowStateById(
    flowInstanceId: string
  ): Promise<InteractiveFlowState<any>>;

  getInteractiveFlowStates(
    flowDefinitionId: string
  ): Promise<InteractiveFlowState<any>[]>;

  createInteractiveFlowState({
    flowDefinitionId,
    initialData,
  }: {
    flowDefinitionId: string;
    initialData: any;
  }): Promise<InteractiveFlowState<any>>;

  updateInteractiveFlowState(
    interactiveFlowState: InteractiveFlowState<any>
  ): Promise<InteractiveFlowState<any>>;

  deleteInteractiveFlowState(flowInstanceId: string): Promise<void>;
}

export interface InteractiveFlowContextOptions<I> {
  flowDefinition: IFlowDefintion;
  interactiveFlowState: InteractiveFlowState<I>;
  onUpdateInteractiveState: OnUpdateInteractiveState<I>;
}

export abstract class InteractiveFlowContext<
  I = any,
  S = any
> extends FlowContext<I, S> {
  interactiveFlowState: InteractiveFlowState<I>;

  onUpdateInteractiveState: OnUpdateInteractiveState<I>;

  constructor(opts: InteractiveFlowContextOptions<I>) {
    super({
      flowDefinition: opts.flowDefinition,
      initialData: opts.interactiveFlowState.initialData,
    });
    this.interactiveFlowState = opts.interactiveFlowState;
    this.onUpdateInteractiveState = opts.onUpdateInteractiveState;
  }

  async getInteractiveFlowStateeStatus(): Promise<CQFlowExecutorStateEnum> {
    return this.interactiveFlowState.status;
  }

  async _updateInteractiveFlowStatee(
    interactiveFlowState: InteractiveFlowState<I>
  ): Promise<void> {
    this.interactiveFlowState = await this.onUpdateInteractiveState(
      interactiveFlowState
    );
  }

  async updateInteractiveFlowStateeStatus(
    status: CQFlowExecutorStateEnum
  ): Promise<void> {
    const nextInstance = cloneDeep(this.interactiveFlowState);
    nextInstance.status = status;
    await this._updateInteractiveFlowStatee(nextInstance);
  }

  async wasActionTaken(stepId: string): Promise<boolean> {
    const actions = this.interactiveFlowState.actionsTaken || {};
    return actions[stepId] === ActionStatusEnum.Success || false;
  }

  async takeAction(nodeId: string): Promise<void> {
    const nextInstance = cloneDeep(this.interactiveFlowState);
    if (!this.interactiveFlowState.actionsTaken) {
      this.interactiveFlowState.actionsTaken = {};
    }
    this.interactiveFlowState.actionsTaken[nodeId] = ActionStatusEnum.Success;
    await this._updateInteractiveFlowStatee(nextInstance);
  }

  getMergedAnswers(): Record<string, FlowStepAnswer> {
    const answers = this.interactiveFlowState.answers || [];

    const currentAnswers: Record<string, FlowStepAnswer> = {};

    // Grab the latest answer
    for (const answer of answers) {
      currentAnswers[answer.stepId] = answer.answer;
    }

    return currentAnswers;
  }

  getAnswerByNodeBinding(nodeBinding: string): FlowStepAnswer | null {
    const node = this.getFlowDefinitionNodeByBindId(nodeBinding);
    const answers = this.getMergedAnswers();
    return (node && answers[node.id]) || null;
  }
}
