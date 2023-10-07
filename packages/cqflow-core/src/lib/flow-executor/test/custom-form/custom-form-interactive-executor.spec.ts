import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { ExecNode } from '../../../flow-nodes/exec-node';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { inputDataFlowDefinition } from './custom-form-flow-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import { JSONSchema7 } from 'json-schema';
import { ICustomDataAnswer } from '../../../flow-steps/answers';
import {
  TernaryEnum,
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { CustomFormNode } from '../../../flow-nodes';

interface IntitialData {
  patientId: string;
}

type ContextData = null;

// const simpleFlowImplementation =
describe('Interactive Executor custom form node', () => {
  it('should evaluate with bound node', async () => {
    class CustomFormContext extends InteractiveFlowContext<
      IntitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<CustomFormContext>();

    interface WeightData {
      weight: number;
    }

    class InputWeight extends CustomFormNode<CustomFormContext, WeightData> {
      override getValueJsonSchema(): JSONSchema7 {
        return {
          type: 'object',
          properties: {
            weight: {
              type: 'number',
              description: 'Units in lbs',
            },
          },
        };
      }
    }

    class IsWeightOver100 extends ExecNode<CustomFormContext> {
      override async evaluate(
        context: CustomFormContext
      ): Promise<TernaryEnum> {
        const answer = context.getAnswerByNodeBinding(
          'enter_weight'
        ) as ICustomDataAnswer | null;

        const value = answer?.value as WeightData | null;

        if (!value) {
          return TernaryEnum.UNKNOWN;
        }

        return value.weight > 100 ? TernaryEnum.TRUE : TernaryEnum.FALSE;
      }
    }

    simpleFlowImplementation.registerCustomForm(
      'enter_weight',
      (def) => new InputWeight(def)
    );
    simpleFlowImplementation.registerTrueFalse(
      'is_above_100_lbs',
      (def) => new IsWeightOver100(def)
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

    const context = new CustomFormContext({
      flowDefinition: inputDataFlowDefinition,
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
    expect(result[1].stepType).toEqual(
      ImplementationNodeTypeEnum.CustomDataInput
    );

    // Add positive weight
    interactiveFlowState.answers.push({
      stepId: 'input_data_1',
      answer: {
        answerType: AnswerTypeEnum.CustomData,
        value: {
          weight: 200,
        },
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(4);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(
      ImplementationNodeTypeEnum.CustomDataInput
    );
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.Exec);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);
    expect(result[3].stepId).toEqual('end_true');

    // Add negative weight
    interactiveFlowState.answers.push({
      stepId: 'input_data_1',
      answer: {
        answerType: AnswerTypeEnum.CustomData,
        value: {
          weight: 50,
        },
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(4);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(
      ImplementationNodeTypeEnum.CustomDataInput
    );
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.Exec);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);
    expect(result[3].stepId).toEqual('end_false');
  });
  it('should evaluate default to a text when missing a bound node', async () => {
    const DUMMY_VAL = 'Dummy';

    class CustomFormContext extends InteractiveFlowContext<
      IntitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<CustomFormContext>();

    interface WeightData {
      weight: number;
    }

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

    const context = new CustomFormContext({
      flowDefinition: inputDataFlowDefinition,
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
    expect(result[1].stepType).toEqual(
      ImplementationNodeTypeEnum.CustomDataInput
    );

    // Add positive weight
    interactiveFlowState.answers.push({
      stepId: 'input_data_1',
      answer: {
        answerType: AnswerTypeEnum.CustomData,
        value: {
          value: DUMMY_VAL,
        },
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(3);

    const formStep = result[1];

    if (formStep.stepType !== ImplementationNodeTypeEnum.CustomDataInput) {
      throw new Error('Expected a custom data input step');
    }

    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(formStep.stepType).toEqual(
      ImplementationNodeTypeEnum.CustomDataInput
    );
    expect(formStep.answer?.value?.value).toEqual(DUMMY_VAL);
  });
});
