import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { actionDefinition } from './action-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import {
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
  ActionEnum,
  ActionStatusEnum,
} from '../../../enums';

interface InitialData {
  patientId: string;
}

type ContextData = null;

describe('Interactive Executor Action', () => {
  it('should work in the dummy case', async () => {
    class ActionContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<ActionContext>();

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

    const context = new ActionContext({
      flowDefinition: actionDefinition,
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
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Action);

    // Add True answer
    interactiveFlowState.answers.push({
      stepId: 'action_1',
      answer: {
        answerType: AnswerTypeEnum.Action,
        submitted: ['action_option_1'],
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    const actionStep = result[1];

    if (actionStep.stepType !== ImplementationNodeTypeEnum.Action) {
      throw new Error('Expected text step');
    }

    expect(result.length).toEqual(3);
    expect(actionStep.stepType).toEqual(ImplementationNodeTypeEnum.Action);
    expect(actionStep.answer?.submitted[0]).toEqual('action_option_1');
    expect(actionStep.statuses['action_option_1']).toEqual(
      ActionStatusEnum.Success
    );
    expect(actionStep.statuses['action_option_2']).toEqual(
      ActionStatusEnum.NotTaken
    );
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });

  // it('should work in the override case', async () => {
  //   const MY_DISEASE = 'my disease';

  //   class ActionContext extends InteractiveFlowContext<
  //     InitialData,
  //     ContextData
  //   > {}

  //   const simpleFlowImplementation =
  //     new InteractiveFlowImplementation<ActionContext>();

  //   class EnterNumber extends NumberFieldNode<ActionContext> {
  //     override async getValue(
  //       context: ActionContext
  //     ): Promise<number | null> {
  //       return 10;
  //     }
  //   }

  //   simpleFlowImplementation.registerNumberField(
  //     'field_number_1',
  //     (nodeDef) => new EnterNumber(nodeDef)
  //   );

  //   const interactiveFlowState: InteractiveFlowState<InitialData> = {
  //     id: '1234',
  //     status: CQFlowExecutorStateEnum.Initiated,
  //     answers: [],
  //     actionsTaken: {},
  //     initialData: {
  //       patientId: '123',
  //     },
  //   };

  //   const onUpdateInteractiveState = async (
  //     state: InteractiveFlowState<InitialData>
  //   ) => state;

  //   const context = new ActionContext({
  //     flowDefinition: fieldNumberDef,
  //     interactiveFlowState: interactiveFlowState,
  //     onUpdateInteractiveState: onUpdateInteractiveState,
  //   });

  //   let result = await executeInteractiveFlow(
  //     simpleFlowImplementation,
  //     context
  //   );

  //   result = await executeInteractiveFlow(simpleFlowImplementation, context);

  //   expect(result.length).toEqual(3);

  //   const textStep = result[1];

  //   if (textStep.stepType !== ImplementationNodeTypeEnum.NumberField) {
  //     throw new Error('Expected text step');
  //   }

  //   expect(textStep.stepType).toEqual(ImplementationNodeTypeEnum.NumberField);
  //   expect(textStep.evaluation?.value).toEqual(10);
  //   expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  // });
});
