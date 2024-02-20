import { FlowContext, LazyFlowDefinitionRetriever } from './flow-context';
import { IFlowStepAnswer, IYesNoAnswer } from '../flow-steps/answers';
import { CQFlowExecutorStateEnum, ActionStatusEnum } from '../enums';
import { InteractiveFlowState } from '../flow-executor/interactive-flow-state';
import cloneDeep from 'lodash/cloneDeep';
import { IFlowDefinition } from '../flow-definition';

export interface CQFlowExecutorStatefulAnswer {
  stepId: string;
  answer: IFlowStepAnswer;
}

// interface ContextState {
//   id: string;
//   status: CQFlowExecutorStateEnum;
//   answers: CQFlowExecutorStatefulAnswer[];
//   actionsTaken: Record<string, boolean>;
// }

export type OnUpdateInteractiveState<I> = (
  interactiveFlowState: InteractiveFlowState<I>
) => Promise<InteractiveFlowState<I>>;

/**
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
*/

// export abstract class LazyFlowDefinitionRetriever {
//   abstract loadFlowDefinitionById(id: string): Promise<IFlowDefinition> 
// }

export interface InteractiveFlowContextOptions<
  I = any,
  S = CQFlowExecutorStateEnum
> {
  flowDefinitionId: string
  flowDefinitionRetriever: LazyFlowDefinitionRetriever
  interactiveFlowState: InteractiveFlowState<I, S>;
  onUpdateInteractiveState: OnUpdateInteractiveState<I>;
  initialData: I;
}

export abstract class InteractiveFlowContext<
  I = any,
  S = any
> extends FlowContext<I, S> {
  interactiveFlowState: InteractiveFlowState<I>;

  onUpdateInteractiveState: OnUpdateInteractiveState<I>;

  constructor(opts: InteractiveFlowContextOptions<I>) {
    super({
      flowDefinitionId: opts.flowDefinitionId,
      flowDefinitionRetriever: opts.flowDefinitionRetriever,
      initialData: opts.initialData,
    });
    this.interactiveFlowState = opts.interactiveFlowState;
    this.onUpdateInteractiveState = opts.onUpdateInteractiveState;
  }

  async getInteractiveFlowStateStatus(): Promise<CQFlowExecutorStateEnum> {
    return this.interactiveFlowState.status;
  }

  async _updateInteractiveFlowState(
    interactiveFlowState: InteractiveFlowState<I>
  ): Promise<void> {
    this.interactiveFlowState = await this.onUpdateInteractiveState(
      interactiveFlowState
    );
  }

  async updateInteractiveFlowStateStatus(
    status: CQFlowExecutorStateEnum
  ): Promise<void> {
    const nextInstance = cloneDeep(this.interactiveFlowState);
    nextInstance.status = status;
    await this._updateInteractiveFlowState(nextInstance);
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
    await this._updateInteractiveFlowState(nextInstance);
  }

  getMergedAnswers(): Record<string, IFlowStepAnswer> {
    const answers = this.interactiveFlowState.answers || [];

    const currentAnswers: Record<string, IFlowStepAnswer> = {};

    // Grab the latest answer
    for (const answer of answers) {
      currentAnswers[answer.stepId] = answer.answer;
    }

    return currentAnswers;
  }

  async getAnswerByNodeBinding(nodeBinding: string): Promise<IFlowStepAnswer | null> {
    const node = await this.getFlowDefinitionNodeByBindId(nodeBinding);
    const answers = this.getMergedAnswers();
    return (node && answers[node.id]) || null;
  }
}
