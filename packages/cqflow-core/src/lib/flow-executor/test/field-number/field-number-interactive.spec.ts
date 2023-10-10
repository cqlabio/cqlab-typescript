import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { fieldNumberDef } from './field-number-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import {
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { NumberFieldNode, TextFieldNode } from '../../../flow-nodes';

interface InitialData {
  patientId: string;
}

type ContextData = null;

describe('Interactive Executor Number Field', () => {
  it('should work in the default case', async () => {
    class NumberFieldContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<NumberFieldContext>();

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

    const context = new NumberFieldContext({
      flowDefinition: fieldNumberDef,
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
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.NumberField);

    // Add True answer
    interactiveFlowState.answers.push({
      stepId: 'field_number_1',
      answer: {
        answerType: AnswerTypeEnum.Number,
        value: 10,
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    const textStep = result[1];

    if (textStep.stepType !== ImplementationNodeTypeEnum.NumberField) {
      throw new Error('Expected text step');
    }

    expect(result.length).toEqual(3);
    expect(textStep.stepType).toEqual(ImplementationNodeTypeEnum.NumberField);
    expect(textStep.answer?.value).toEqual(10);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });

  it('should work in the override case', async () => {
    const MY_DISEASE = 'my disease';

    class NumberFieldContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<NumberFieldContext>();

    class EnterNumber extends NumberFieldNode<NumberFieldContext> {
      override async getValue(
        context: NumberFieldContext
      ): Promise<number | null> {
        return 10;
      }
    }

    simpleFlowImplementation.registerNumberField(
      'field_number_1',
      (nodeDef) => new EnterNumber(nodeDef)
    );

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

    const context = new NumberFieldContext({
      flowDefinition: fieldNumberDef,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    let result = await executeInteractiveFlow(
      simpleFlowImplementation,
      context
    );

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(3);

    const textStep = result[1];

    if (textStep.stepType !== ImplementationNodeTypeEnum.NumberField) {
      throw new Error('Expected text step');
    }

    expect(textStep.stepType).toEqual(ImplementationNodeTypeEnum.NumberField);
    expect(textStep.evaluation?.value).toEqual(10);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });
});
