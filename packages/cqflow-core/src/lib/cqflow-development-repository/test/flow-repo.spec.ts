import { FlowRepository } from '../flow-repository';
import { TernaryEnum, CQFlowExecutorStateEnum } from '../../enums';
import { InteractiveFlowImplementation } from '../../cqflow-implementation/interactive-flow-implementation';
import { NonInteractiveFlowImplementation } from '../../cqflow-implementation/non-interactive-flow-implementation';
import { FlowContext } from '../../cqflow-context/cqflow-context';
import { InteractiveFlowState } from '../../cqflow-executor/interactive-flow-state';
import { trueFalseFlowDefinition } from '../../cqflow-executor/test/true-false/true-false-flow-definition';
import { InteractiveFlowContext } from '../../cqflow-context/interactive-flow-context';

describe('Interactive Executor Input node', () => {
  it('should evaluate input correctly', async () => {
    interface IntitialData {
      patientId: string;
    }

    type ContextData = null;

    class TrueFalseContext extends InteractiveFlowContext<
      IntitialData,
      ContextData
    > {
      isFemale(): TernaryEnum {
        return TernaryEnum.TRUE;
      }
    }

    const trueFalseImplementation =
      new InteractiveFlowImplementation<TrueFalseContext>();

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

    // const context = new TrueFalseContext({
    //   flowDefinition: trueFalseFlowDefinition,
    //   interactiveFlowState: interactiveFlowState,
    //   onUpdateInteractiveState: onUpdateInteractiveState,
    // });

    const flowRepository = new FlowRepository();

    // flowContextKlass: TrueFalseContext,
    flowRepository.registerInteractiveModule<IntitialData>('my_flow', {
      flowImplementation: trueFalseImplementation,
      flowContext: (contextOpts) => new TrueFalseContext(contextOpts),
      testData: [{ patientId: '1234' }],
    });

    const module = flowRepository.getInteractiveModule('my_flow');
    if (!module) {
      throw new Error('Expecting a module');
    }

    const result = await module.execute({
      flowDefinition: trueFalseFlowDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    expect(result.length).toEqual(2);
  });
});
