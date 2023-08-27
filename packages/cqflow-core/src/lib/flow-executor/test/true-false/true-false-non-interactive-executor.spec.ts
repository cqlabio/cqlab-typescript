import { TernaryEnum, ImplementationNodeTypeEnum } from '../../../enums';
import { NonInteractiveFlowImplementation } from '../../../flow-implementation/non-interactive-flow-implementation';
import { ExecNode } from '../../../flow-nodes/exec-node';
import { FlowContext } from '../../../flow-context/flow-context';
import { executeNonInteractiveFlow } from '../../executor-non-interactive';
import { trueFalseFlowDefinition } from './true-false-flow-definition';
import { ExecStep } from '../../../flow-steps';

interface IntitialData {
  patientId: string;
}

type ContextData = null;

// const trueFalseImplementation =
describe('Non-Interactive Executor True/False node', () => {
  it('should go true path when result is true', async () => {
    class TrueFalseContext extends FlowContext<IntitialData, ContextData> {
      isFemale(): TernaryEnum {
        return TernaryEnum.TRUE;
      }
    }

    class IsFemale extends ExecNode<TrueFalseContext> {
      override async evaluate(context: TrueFalseContext): Promise<TernaryEnum> {
        return context.isFemale();
      }
    }

    const trueFalseImplementation =
      new NonInteractiveFlowImplementation<TrueFalseContext>();

    trueFalseImplementation.registerTrueFalse(
      'is_female',
      (def) => new IsFemale(def)
    );

    const context = new TrueFalseContext({
      initialData: { patientId: '123' },
      flowDefinition: trueFalseFlowDefinition,
    });

    const result = await executeNonInteractiveFlow(
      trueFalseImplementation,
      context
    );

    expect(result.length).toEqual(4);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);

    const execResult = result[1] as ExecStep;
    expect(execResult.evaluation).toEqual(TernaryEnum.TRUE);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });

  it('should default false path when not configured', async () => {
    class TrueFalseContext extends FlowContext<IntitialData, ContextData> {}

    const trueFalseImplementation =
      new NonInteractiveFlowImplementation<TrueFalseContext>();

    const context = new TrueFalseContext({
      initialData: { patientId: '123' },
      flowDefinition: trueFalseFlowDefinition,
    });

    const result = await executeNonInteractiveFlow(
      trueFalseImplementation,
      context
    );

    expect(result.length).toEqual(3);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);

    const execResult = result[1] as ExecStep;
    expect(execResult.evaluation).toEqual(TernaryEnum.FALSE);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });

  it('should go false path when result is unknown', async () => {
    class TrueFalseContext extends FlowContext<IntitialData, ContextData> {}

    class IsFemale extends ExecNode<TrueFalseContext> {
      override async evaluate(): Promise<TernaryEnum> {
        return TernaryEnum.UNKNOWN;
      }
    }

    const trueFalseImplementation =
      new NonInteractiveFlowImplementation<TrueFalseContext>();

    trueFalseImplementation.registerTrueFalse(
      'is_female',
      (def) => new IsFemale(def)
    );

    const context = new TrueFalseContext({
      initialData: { patientId: '123' },
      flowDefinition: trueFalseFlowDefinition,
    });

    const result = await executeNonInteractiveFlow(
      trueFalseImplementation,
      context
    );

    expect(result.length).toEqual(3);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);

    const execResult = result[1] as ExecStep;
    expect(execResult.evaluation).toEqual(TernaryEnum.UNKNOWN);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });
});
