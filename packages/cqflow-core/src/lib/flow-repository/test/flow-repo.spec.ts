import { FlowRepository } from '../flow-repository';
import { TernaryEnum, CQFlowExecutorStateEnum } from '../../enums';
import { InteractiveFlowImplementation } from '../../flow-implementation/interactive-flow-implementation';
import { NonInteractiveFlowImplementation } from '../../flow-implementation/non-interactive-flow-implementation';
import { FlowContext } from '../../flow-context/flow-context';
import { InteractiveFlowState } from '../../flow-executor/interactive-flow-state';
import { trueFalseFlowDefinition } from '../../flow-executor/test/true-false/true-false-flow-definition';
import { InteractiveFlowContext } from '../../flow-context/interactive-flow-context';

describe('Flow Repository configuration and executor', () => {
  it('should work for non-interactive flows', async () => {
    interface InitialData {
      patientId: string;
    }

    type ContextData = null;

    class TrueFalseContext extends FlowContext<InitialData, ContextData> {}

    const trueFalseImplementation =
      new NonInteractiveFlowImplementation<TrueFalseContext>();

    const flowRepository = new FlowRepository();

    flowRepository.registerNonInteractiveModule<InitialData>('my_flow', {
      flowImplementation: trueFalseImplementation,
      flowContext: (contextOpts) => new TrueFalseContext(contextOpts),
      testData: [{ patientId: '1234' }],
    });

    const flowModule = flowRepository.getNonInteractiveModule('my_flow');

    if (!flowModule) {
      throw new Error('Expecting a module');
    }

    const result = await flowModule.execute({
      flowDefinition: trueFalseFlowDefinition,
      initialData: {
        patientId: '1234',
      },
    });

    // Just make sure there is a result
    expect(result.length).toEqual(3);
  });

  it('should work for interactive flows', async () => {
    interface InitialData {
      patientId: string;
    }

    type ContextData = null;

    class TrueFalseContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {
      isFemale(): TernaryEnum {
        return TernaryEnum.TRUE;
      }
    }

    const trueFalseImplementation =
      new InteractiveFlowImplementation<TrueFalseContext>();

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

    const flowRepository = new FlowRepository();

    flowRepository.registerInteractiveModule<InitialData>('my_flow', {
      flowImplementation: trueFalseImplementation,
      flowContext: (contextOpts) => new TrueFalseContext(contextOpts),
      testData: [{ patientId: '1234' }],
    });

    const flowModule = flowRepository.getInteractiveModule('my_flow');

    if (!flowModule) {
      throw new Error('Expecting a module');
    }

    const result = await flowModule.execute({
      flowDefinition: trueFalseFlowDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    // Just make sure there is a result
    expect(result.length).toEqual(2);
  });
});
