import { InteractiveFlowImplementation } from '../../../cqflow-implementation/interactive-flow-implementation';
import { ExecNode } from '../../../cqflow-nodes/exec-node';
import { InteractiveFlowContext } from '../../../cqflow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { trueFalseFlowDefinition } from './true-false-flow-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import {
  TernaryEnum,
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { EmitDataNode } from '../../../cqflow-nodes';

interface IntitialData {
  patientId: string;
}

type ContextData = null;

export class SimpleContextBase extends InteractiveFlowContext<
  IntitialData,
  ContextData
> {
  isFemale(): TernaryEnum {
    return TernaryEnum.TRUE;
  }
}

class IsFemale extends ExecNode<SimpleContextBase> {
  override async evaluate(context: SimpleContextBase): Promise<TernaryEnum> {
    return TernaryEnum.UNKNOWN;
  }
}

const simpleFlowImplementation =
  new InteractiveFlowImplementation<SimpleContextBase>();

// simpleFlowImplementation.registerNodeBinding('is_female', IsFemale);

simpleFlowImplementation.registerTrueFalse(
  'is_female',
  (def) => new IsFemale(def)
);

// simpleFlowImplementation.registerEmitData('is_female', (definition) => {
//   const emitData = new EmitDataNode(definition);
//   return emitData;
// });

// simpleFlowImplementation.registerEmitData('is_female', (definition) => {
//   withExec(definition, (context) => {
//     return TernaryEnum.TRUE;
//   });
// });

// function withExec<C extends InteractiveFlowContext<any, any>> (definition: any) {

//   const someNode = new ExecNode<C>(definition);

//   someNode.setExecutor((context) => {
//     return TernaryEnum.TRUE;
//   });

//   return someNode;
// }

// simpleFlowImplementation.registerTrueFalse('is_female', (definition) => {
//   const someNode = new ExecNode<SimpleContextBase>(definition);

//   someNode.setExecutor((context) => {
//     return TernaryEnum.TRUE;
//   });

//   return someNode;
// });

// const simpleFlowImplementation =
describe('Interactive Executor Simple Example', () => {
  it('should work', async () => {
    let interactiveFlowState: InteractiveFlowState<IntitialData> = {
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
    ) => {
      interactiveFlowState = state;
      return state;
    };

    const context = new SimpleContextBase({
      flowDefinition: trueFalseFlowDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    let result = await executeInteractiveFlow(
      simpleFlowImplementation,
      context
    );

    // B/C the execution in unknown, we need interaction
    expect(result.length).toEqual(2);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);

    // Add an answer
    interactiveFlowState.answers.push({
      stepId: 'true_false_1',
      answer: {
        answerType: AnswerTypeEnum.YesNo,
        value: TernaryEnum.TRUE,
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(4);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });
});
