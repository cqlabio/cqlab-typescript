import { IFlowDefintion } from '../../cqflow-definition/cqflow-definition';
import {
  NextTypeEnum,
  DefinitionNodeTypeEnum,
  TernaryEnum,
  ImplementationNodeTypeEnum,
} from '../../enums';
import { NonInteractiveFlowImplementation } from '../../cqflow-implementation/non-interactive-flow-implementation';
import { ExecNode } from '../../cqflow-nodes/exec-node';
import { FlowContext } from '../../cqflow-context/cqflow-context';
import { executeNonInteractive } from '../cqflow-executor-non-interactive';
import { simpleFlowDefinition } from './simple/simple-flow-definition';

interface IntitialData {
  patientId: string;
}

type ContextData = null;

export class SimpleContextBase extends FlowContext<IntitialData, ContextData> {
  isFemale(): TernaryEnum {
    return TernaryEnum.TRUE;
  }
}

class IsFemale extends ExecNode<SimpleContextBase> {
  override async evaluate(context: SimpleContextBase): Promise<TernaryEnum> {
    return context.isFemale();
  }
}

const simpleFlowImplementation =
  new NonInteractiveFlowImplementation<SimpleContextBase>();

simpleFlowImplementation.registerTrueFalse(
  'is_female',
  (def) => new IsFemale(def)
);

// const simpleFlowImplementation =
describe('Non-Interactive Executor Simple Example', () => {
  it('should work', async () => {
    const context = new SimpleContextBase({
      initialData: { patientId: '123' },
      flowDefinition: simpleFlowDefinition,
    });

    const result = await executeNonInteractive(
      simpleFlowImplementation,
      context
    );

    expect(result.length).toEqual(4);
    expect(result[0].stepType).toEqual(ImplementationNodeTypeEnum.Start);
    expect(result[1].stepType).toEqual(ImplementationNodeTypeEnum.Exec);
    expect(result[2].stepType).toEqual(ImplementationNodeTypeEnum.EmitData);
    expect(result[3].stepType).toEqual(ImplementationNodeTypeEnum.End);
  });
});
