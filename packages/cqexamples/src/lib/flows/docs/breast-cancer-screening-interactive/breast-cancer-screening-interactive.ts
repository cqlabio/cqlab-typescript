export * from './breast-cancer-screening-interactive-context';
import { BreastCancerScreeningContext } from './breast-cancer-screening-interactive-context';
import {
  InteractiveFlowImplementation,
  ExecNode,
  TernaryEnum,
} from '@cqlab/cqflow-core';

enum BreastCancerScreeningEnum {
  is_female = 'is_female',
  is_over_45 = 'is_over_45_years_old',
}

class IsFemale extends ExecNode<BreastCancerScreeningContext> {
  override async evaluate(
    context: BreastCancerScreeningContext
  ): Promise<TernaryEnum> {
    return context.breastCancerScreeningLibrary.isFemale();
  }
}
class IsOver45 extends ExecNode<BreastCancerScreeningContext> {
  override async evaluate(
    context: BreastCancerScreeningContext
  ): Promise<TernaryEnum> {
    return context.breastCancerScreeningLibrary.isOver45();
  }
}

export const breastCancerScreeningImplementation =
  new InteractiveFlowImplementation<BreastCancerScreeningContext>();

breastCancerScreeningImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.is_female,
  (nodeDef) => new IsFemale(nodeDef)
);

breastCancerScreeningImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.is_over_45,
  (nodeDef) => new IsOver45(nodeDef)
);
