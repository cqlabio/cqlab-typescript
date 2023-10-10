import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { ExecNode } from '../../../flow-nodes/exec-node';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { branchChoiceDefinition } from './branch-choice-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import {
  TernaryEnum,
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { EmitDataNode } from '../../../flow-nodes';
import { IBranchChoiceStep } from '../../../flow-steps';

interface InitialData {
  patientId: string;
}

type ContextData = null;

describe('Interactive Executor Branch node', () => {
  it('should default to a BranchChoice interaction', async () => {
    class BranchChoiceInteractiveContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    const branchChoiceImplementation =
      new InteractiveFlowImplementation<BranchChoiceInteractiveContext>();

    const interactiveFlowState: InteractiveFlowState<InitialData> = {
      id: '1234',
      status: CQFlowExecutorStateEnum.Initiated,
      answers: [],
      actionsTaken: {},
      initialData: {
        patientId: '123',
      },
    };

    const onUpdateInteractiveState = async (
      state: InteractiveFlowState<InitialData>
    ) => state;

    const context = new BranchChoiceInteractiveContext({
      flowDefinition: branchChoiceDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    let result = await executeInteractiveFlow(
      branchChoiceImplementation,
      context
    );

    // Without an answer, we wait for interaction
    expect(result.length).toEqual(2);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.BranchChoice);

    // Add True answer
    interactiveFlowState.answers.push({
      stepId: 'branch_1',
      answer: {
        answerType: AnswerTypeEnum.SingleOption,
        selectedId: 'option_1',
      },
    });

    result = await executeInteractiveFlow(branchChoiceImplementation, context);

    expect(result.length).toEqual(3);
    expect((result[1] as IBranchChoiceStep).answer?.selectedId).toEqual(
      'option_1'
    );
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
    expect(result[2].stepId).toEqual('end_1');

    interactiveFlowState.answers.push({
      stepId: 'branch_1',
      answer: {
        answerType: AnswerTypeEnum.SingleOption,
        selectedId: 'option_2',
      },
    });

    result = await executeInteractiveFlow(branchChoiceImplementation, context);

    expect(result.length).toEqual(3);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
    expect(result[2].stepId).toEqual('end_2');
  });
});
