import { ActionStatusEnum, CQFlowExecutorStateEnum } from '../enums';
import { CQFlowExecutorStatefulAnswer } from '../cqflow-context/interactive-flow-context';

export interface InteractiveFlowState<I> {
  id: string;

  // flowDefinitionId: string;

  status: CQFlowExecutorStateEnum;

  answers: CQFlowExecutorStatefulAnswer[];

  actionsTaken: Record<string, ActionStatusEnum>;

  initialData: I;
}
