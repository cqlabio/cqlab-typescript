import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { ExecNode } from '../../../flow-nodes/exec-node';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { inputDataFlowDefinition } from './input-data-flow-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import { JSONSchema7 } from 'json-schema';
import { ICustomDataAnswer } from '../../../flow-steps/answers';
import {
  TernaryEnum,
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { CustomDataInputNode } from '../../../flow-nodes';

interface IntitialData {
  patientId: string;
}

type ContextData = null;

// const simpleFlowImplementation =
describe('Interactive Executor Input node', () => {
  it('should evaluate input correctly', async () => {
    class InputDataExampleContext extends InteractiveFlowContext<
      IntitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<InputDataExampleContext>();

    interface WeightData {
      weight: number;
    }

    class InputWeight extends CustomDataInputNode<
      InputDataExampleContext,
      WeightData
    > {
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

    class IsWeightOver100 extends ExecNode<InputDataExampleContext> {
      override async evaluate(
        context: InputDataExampleContext
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

    simpleFlowImplementation.registerInputData(
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

    const context = new InputDataExampleContext({
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
});
