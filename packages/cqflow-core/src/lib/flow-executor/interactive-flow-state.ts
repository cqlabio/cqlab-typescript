import { ActionStatusEnum, CQFlowExecutorStateEnum } from '../enums';
import { CQFlowExecutorStatefulAnswer } from '../flow-context/interactive-flow-context';

export interface InteractiveFlowState<I, S = CQFlowExecutorStateEnum> {
  id: string;

  initialData: I;

  status: S;

  answers: CQFlowExecutorStatefulAnswer[];

  actionsTaken: Record<string, ActionStatusEnum>;
}
