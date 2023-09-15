import { NonInteractiveFlowImplementation } from '../../../flow-implementation/non-interactive-flow-implementation';
import { EmitDataNode } from '../../../flow-nodes/emitdata-node';
import { FlowContext } from '../../../flow-context/flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { emitDataFlowDefinition } from './emit-data-flow-definition';
import { executeNonInteractiveFlow } from '../../executor-non-interactive';
import { InteractiveFlowState } from '../../interactive-flow-state';

import {
  TernaryEnum,
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { CustomDataInputNode } from '../../../flow-nodes';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';

interface IntitialData {
  patientId: string;
}

// const simpleFlowImplementation =
describe('Interactive Executor Emit and Narrative node', () => {
  it('should work for non-interactive flows', async () => {
    interface OutData {
      message: string;
    }

    class EmitDataExampleContext extends FlowContext<IntitialData, OutData> {}

    const simpleFlowImplementation =
      new NonInteractiveFlowImplementation<EmitDataExampleContext>();

    const MESSAGE = 'Heart Failure Confirmed';

    class EmitHeartFailureConfirmed extends EmitDataNode<
      EmitDataExampleContext,
      OutData
    > {
      override async getContextData(): Promise<OutData[]> {
        return [
          {
            message: MESSAGE,
          },
        ];
      }
    }

    simpleFlowImplementation.registerEmitData(
      'emit_node',
      (def) => new EmitHeartFailureConfirmed(def)
    );

    const context = new EmitDataExampleContext({
      initialData: { patientId: '123' },
      flowDefinition: emitDataFlowDefinition,
    });

    const result = await executeNonInteractiveFlow(
      simpleFlowImplementation,
      context
    );

    // Without an answer, we wait for interaction
    expect(result.length).toEqual(5);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Narrative);
    // Configured node
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    // Not-Configured node
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[4].stepType).toEqual(ImplementationNodeTypeEnum.End);

    expect(context.getContextDataStack().length).toEqual(1);
    expect(context.getContextDataStack()[0].data.message).toEqual(MESSAGE);
  });

  it('should work for interactive flows', async () => {
    interface OutData {
      message: string;
    }

    class EmitDataExampleContext extends InteractiveFlowContext<
      IntitialData,
      OutData
    > {}

    const simpleFlowImplementation =
      new NonInteractiveFlowImplementation<EmitDataExampleContext>();

    const MESSAGE = 'Heart Failure Confirmed';

    class EmitHeartFailureConfirmed extends EmitDataNode<
      EmitDataExampleContext,
      OutData
    > {
      override async getContextData(): Promise<OutData[]> {
        return [
          {
            message: MESSAGE,
          },
        ];
      }
    }

    simpleFlowImplementation.registerEmitData(
      'emit_node',
      (def) => new EmitHeartFailureConfirmed(def)
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

    const context = new EmitDataExampleContext({
      flowDefinition: emitDataFlowDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    const result = await executeInteractiveFlow(
      simpleFlowImplementation,
      context
    );

    // Without an answer, we wait for interaction
    expect(result.length).toEqual(5);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Narrative);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[4].stepType).toEqual(ImplementationNodeTypeEnum.End);

    expect(context.getContextDataStack().length).toEqual(1);
    expect(context.getContextDataStack()[0].data.message).toEqual(MESSAGE);
  });
});
