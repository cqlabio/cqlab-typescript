import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { fieldTextDef } from './field-text-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import {
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { TextFieldNode } from '../../../flow-nodes';

interface IntitialData {
  patientId: string;
}

type ContextData = null;

describe('Interactive Executor Option Select node', () => {
  it('should default to a YesNo interaction', async () => {
    class TextFieldContext extends InteractiveFlowContext<
      IntitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<TextFieldContext>();

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

    const context = new TextFieldContext({
      flowDefinition: fieldTextDef,
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
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.TextField);

    // Add True answer
    interactiveFlowState.answers.push({
      stepId: 'field_text_1',
      answer: {
        answerType: AnswerTypeEnum.Text,
        value: 'hellos',
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    const textStep = result[1];

    if (textStep.stepType !== ImplementationNodeTypeEnum.TextField) {
      throw new Error('Expected text step');
    }

    expect(result.length).toEqual(3);
    expect(textStep.stepType).toEqual(ImplementationNodeTypeEnum.TextField);
    expect(textStep.answer?.value).toEqual('hellos');
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });

  it('should default to a YesNo interaction', async () => {
    const MY_DISEASE = 'my disease';

    class TextFieldContext extends InteractiveFlowContext<
      IntitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<TextFieldContext>();

    class EnterTextDisease extends TextFieldNode<TextFieldContext> {
      override async getValue(
        context: TextFieldContext
      ): Promise<string | null> {
        return MY_DISEASE;
      }
    }

    simpleFlowImplementation.registerTextField(
      'field_text_1',
      (nodeDef) => new EnterTextDisease(nodeDef)
    );

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

    const context = new TextFieldContext({
      flowDefinition: fieldTextDef,
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

    if (textStep.stepType !== ImplementationNodeTypeEnum.TextField) {
      throw new Error('Expected text step');
    }

    expect(textStep.stepType).toEqual(ImplementationNodeTypeEnum.TextField);
    expect(textStep.evaluation?.value).toEqual(MY_DISEASE);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });
});
