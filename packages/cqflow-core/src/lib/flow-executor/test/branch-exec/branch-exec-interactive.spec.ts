import { InteractiveFlowImplementation } from '../../../flow-implementation/interactive-flow-implementation';
import { ExecNode } from '../../../flow-nodes/exec-node';
import { InteractiveFlowContext } from '../../../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../../executor-interactive';
import { branchChoiceDefinition } from './branch-exec-definition';
import { InteractiveFlowState } from '../../interactive-flow-state';
import {
  TernaryEnum,
  ImplementationNodeTypeEnum,
  CQFlowExecutorStateEnum,
  AnswerTypeEnum,
} from '../../../enums';
import {
  BranchExecNode,
  BranchOptionExec,
  EmitDataNode,
} from '../../../flow-nodes';
import { IBranchChoiceStep } from '../../../flow-steps';

interface InitialData {
  patientId: string;
}

type ContextData = null;

describe('Interactive Executor Branch node', () => {
  it('should allows execution of first branch option', async () => {
    class BranchChoiceInteractiveContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    const branchChoiceImplementation =
      new InteractiveFlowImplementation<BranchChoiceInteractiveContext>();

    class OptionOne extends BranchOptionExec<BranchChoiceInteractiveContext> {
      override async evaluate(
        context: BranchChoiceInteractiveContext
      ): Promise<TernaryEnum> {
        return TernaryEnum.TRUE;
      }
    }

    class OptionTwo extends BranchOptionExec<BranchChoiceInteractiveContext> {
      override async evaluate(
        context: BranchChoiceInteractiveContext
      ): Promise<TernaryEnum> {
        return TernaryEnum.FALSE;
      }
    }

    class OneBranchNode extends BranchExecNode<BranchChoiceInteractiveContext> {
      override registerBindings(): void {
        this.registerBranchOption(
          'option_1',
          (option) => new OptionOne(option)
        );
        this.registerBranchOption(
          'option_2',
          (option) => new OptionTwo(option)
        );
      }
    }

    branchChoiceImplementation.registerBranch(
      'branch_1',
      (def) => new OneBranchNode(def)
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

    const context = new BranchChoiceInteractiveContext({
      flowDefinition: branchChoiceDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    const result = await executeInteractiveFlow(
      branchChoiceImplementation,
      context
    );

    // Without an answer, we wait for interaction
    expect(result.length).toEqual(3);
    const step = result[1] as IBranchChoiceStep;
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(step.stepType).toEqual(ImplementationNodeTypeEnum.BranchChoice);
    expect(step.evaluation?.selectedId).toEqual('option_1_asldkjasd');
    expect(step.options.length).toEqual(1);
    expect(step.options[0].bindId).toEqual('option_1');
    expect(result[2].stepId).toEqual('end_1');
  });

  it('should allows auto answer one unknown', async () => {
    class BranchChoiceInteractiveContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    const branchChoiceImplementation =
      new InteractiveFlowImplementation<BranchChoiceInteractiveContext>();

    class OptionOne extends BranchOptionExec<BranchChoiceInteractiveContext> {
      override async evaluate(
        context: BranchChoiceInteractiveContext
      ): Promise<TernaryEnum> {
        return TernaryEnum.FALSE;
      }
    }

    class OptionTwo extends BranchOptionExec<BranchChoiceInteractiveContext> {
      override async evaluate(
        context: BranchChoiceInteractiveContext
      ): Promise<TernaryEnum> {
        return TernaryEnum.UNKNOWN;
      }
    }

    class OneBranchNode extends BranchExecNode<BranchChoiceInteractiveContext> {
      override registerBindings(): void {
        this.registerBranchOption(
          'option_1',
          (option) => new OptionOne(option)
        );
        this.registerBranchOption(
          'option_2',
          (option) => new OptionTwo(option)
        );
      }
    }

    branchChoiceImplementation.registerBranch(
      'branch_1',
      (def) => new OneBranchNode(def)
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

    const context = new BranchChoiceInteractiveContext({
      flowDefinition: branchChoiceDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    const result = await executeInteractiveFlow(
      branchChoiceImplementation,
      context
    );

    // Without an answer, we wait for interaction
    expect(result.length).toEqual(3);
    const step = result[1] as IBranchChoiceStep;
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(step.stepType).toEqual(ImplementationNodeTypeEnum.BranchChoice);
    expect(step.evaluation?.selectedId).toEqual('option_2');
    expect(step.options.length).toEqual(1);
    expect(step.options[0].bindId).toEqual('option_2');
    expect(result[2].stepId).toEqual('end_2');
  });

  it('should ask for user interaction with 2 unknowns', async () => {
    class BranchChoiceInteractiveContext extends InteractiveFlowContext<
      InitialData,
      ContextData
    > {}

    const branchChoiceImplementation =
      new InteractiveFlowImplementation<BranchChoiceInteractiveContext>();

    class OptionOne extends BranchOptionExec<BranchChoiceInteractiveContext> {
      override async evaluate(
        context: BranchChoiceInteractiveContext
      ): Promise<TernaryEnum> {
        return TernaryEnum.UNKNOWN;
      }
    }

    class OptionTwo extends BranchOptionExec<BranchChoiceInteractiveContext> {
      override async evaluate(
        context: BranchChoiceInteractiveContext
      ): Promise<TernaryEnum> {
        return TernaryEnum.UNKNOWN;
      }
    }

    class OneBranchNode extends BranchExecNode<BranchChoiceInteractiveContext> {
      override registerBindings(): void {
        this.registerBranchOption(
          'option_1',
          (option) => new OptionOne(option)
        );
        this.registerBranchOption(
          'option_2',
          (option) => new OptionTwo(option)
        );
      }
    }

    branchChoiceImplementation.registerBranch(
      'branch_1',
      (def) => new OneBranchNode(def)
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

    const context = new BranchChoiceInteractiveContext({
      flowDefinition: branchChoiceDefinition,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    let result = await executeInteractiveFlow(
      branchChoiceImplementation,
      context
    );
    expect(result.length).toEqual(2);

    interactiveFlowState.answers.push({
      stepId: 'branch_1',
      answer: {
        answerType: AnswerTypeEnum.SingleOption,
        selectedId: 'option_2',
      },
    });

    result = await executeInteractiveFlow(branchChoiceImplementation, context);

    // Without an answer, we wait for interaction
    expect(result.length).toEqual(3);
    const step = result[1] as IBranchChoiceStep;
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(step.stepType).toEqual(ImplementationNodeTypeEnum.BranchChoice);
    expect(step.answer?.selectedId).toEqual('option_2');
    expect(step.options.length).toEqual(2);
    expect(result[2].stepId).toEqual('end_2');
  });
});
