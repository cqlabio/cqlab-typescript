import { InteractiveFlowContext } from '@cqlab/cqflow-core';

interface IntitialData {
  patientId: string;
}

interface ScreeningRecommendation {
  recommendation: string;
}

export class EmptyInteractiveContext extends InteractiveFlowContext<
  IntitialData,
  ScreeningRecommendation
> {}
