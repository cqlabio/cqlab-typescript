import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { ExecNode } from '../../../flow-nodes/exec-node';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { optionSelectDefinition } from './field-option-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import {
  TernaryEnum,
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { EmitDataNode } from '../../../flow-nodes';

interface IntitialData {
  patientId: string;
}

type ContextData = null;

describe('Interactive Executor Option Select node', () => {
  it('should default to a YesNo interaction', async () => {
    class OptionSelectInteractiveContext extends InteractiveFlowContext<
      IntitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<OptionSelectInteractiveContext>();

    const interactiveFlowState: InteractiveFlowState<IntitialData> = {
      id: '1234',
      status: CQFlowExecutorStateEnum.Initiated,
      answers: [],
      actionsTaken: {},
      initialData: {
        patientId: '123',
      },
    };

    const onUpdateInteractiveState = async (
      state: InteractiveFlowState<IntitialData>
    ) => state;

    const context = new OptionSelectInteractiveContext({
      flowDefinition: optionSelectDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    let result = await executeInteractiveFlow(
      simpleFlowImplementation,
      context
    );

    // Without an answer, we wait for interaction
    expect(result.length).toEqual(2);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.OptionField);

    // Add True answer
    interactiveFlowState.answers.push({
      stepId: 'option_select_1',
      answer: {
        answerType: AnswerTypeEnum.MultiOption,
        selectedIds: ['option_1'],
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(3);

    const optionStep = result[1];

    if (optionStep.stepType !== ImplementationNodeTypeEnum.OptionField) {
      throw new Error('Expected OptionField');
    }
    expect(optionStep.answer?.selectedIds.includes('option_1')).toEqual(true);

    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });
});
