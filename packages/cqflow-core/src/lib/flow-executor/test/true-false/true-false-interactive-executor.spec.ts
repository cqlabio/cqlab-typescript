import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { ExecNode } from '../../../flow-nodes/exec-node';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { trueFalseFlowDefinition } from './true-false-flow-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import {
  TernaryEnum,
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import { EmitDataNode } from '../../../flow-nodes';

interface InitialData {
  patientId: string;
}

type ContextData = null;

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
//   const someNode = new ExecNode<TrueFalseInteractiveContext>(definition);

//   someNode.setExecutor((context) => {
//     return TernaryEnum.TRUE;
//   });

//   return someNode;
// });

// const simpleFlowImplementation =
describe('Interactive Executor True/False node', () => {
  it('should default to a YesNo interaction', async () => {
    class TrueFalseInteractiveContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<TrueFalseInteractiveContext>();

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

    const context = new TrueFalseInteractiveContext({
      flowDefinition: trueFalseFlowDefinition,
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
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.YesNo);

    // Add True answer
    interactiveFlowState.answers.push({
      stepId: 'true_false_1',
      answer: {
        answerType: AnswerTypeEnum.YesNo,
        value: TernaryEnum.TRUE,
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(4);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.YesNo);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);

    // Add False answer
    interactiveFlowState.answers.push({
      stepId: 'true_false_1',
      answer: {
        answerType: AnswerTypeEnum.YesNo,
        value: TernaryEnum.FALSE,
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(3);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.YesNo);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });

  it('should allow answer to be entered when result is UNKNOWN', async () => {
    class TrueFalseInteractiveContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    class IsFemale extends ExecNode<TrueFalseInteractiveContext> {
      override async evaluate(): Promise<TernaryEnum> {
        return TernaryEnum.UNKNOWN;
      }
    }

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<TrueFalseInteractiveContext>();

    simpleFlowImplementation.registerTrueFalse(
      'is_female',
      (def) => new IsFemale(def)
    );

    let interactiveFlowState: InteractiveFlowState<InitialData> = {
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
    ) => {
      interactiveFlowState = state;
      return state;
    };

    const context = new TrueFalseInteractiveContext({
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

    // Add True answer
    interactiveFlowState.answers.push({
      stepId: 'true_false_1',
      answer: {
        answerType: AnswerTypeEnum.YesNo,
        value: TernaryEnum.TRUE,
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(4);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);

    // Add False answer
    interactiveFlowState.answers.push({
      stepId: 'true_false_1',
      answer: {
        answerType: AnswerTypeEnum.YesNo,
        value: TernaryEnum.FALSE,
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(3);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });

  it('should go the true path', async () => {
    class TrueFalseInteractiveContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    class IsFemale extends ExecNode<TrueFalseInteractiveContext> {
      override async evaluate(): Promise<TernaryEnum> {
        return TernaryEnum.TRUE;
      }
    }

    const simpleFlowImplementation =
      new InteractiveFlowImplementation<TrueFalseInteractiveContext>();

    simpleFlowImplementation.registerTrueFalse(
      'is_female',
      (def) => new IsFemale(def)
    );

    let interactiveFlowState: InteractiveFlowState<InitialData> = {
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
    ) => {
      interactiveFlowState = state;
      return state;
    };

    const context = new TrueFalseInteractiveContext({
      flowDefinition: trueFalseFlowDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    let result = await executeInteractiveFlow(
      simpleFlowImplementation,
      context
    );

    // It should go to end since it's true
    expect(result.length).toEqual(4);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);

    // Add False answer
    interactiveFlowState.answers.push({
      stepId: 'true_false_1',
      answer: {
        answerType: AnswerTypeEnum.YesNo,
        value: TernaryEnum.FALSE,
      },
    });

    result = await executeInteractiveFlow(simpleFlowImplementation, context);

    expect(result.length).toEqual(4);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });
});
