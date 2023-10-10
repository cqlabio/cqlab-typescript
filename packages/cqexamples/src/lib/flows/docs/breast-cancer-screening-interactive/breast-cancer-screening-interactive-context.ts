import {
  InteractiveFlowContext,
  InteractiveFlowContextOptions,
} from '@cqlab/cqflow-core';
import { MockFhirBundleRetriever } from '../../common/MockFhirBundleRetriever';
import { BreastCancerScreeningLibrary } from '../../../libraries/breast-cancer-screening-library';
import { PatientIdInitialData } from '../../common/types';

interface ScreeningRecommendation {
  recommendation: string;
}

export class BreastCancerScreeningContext extends InteractiveFlowContext<
  PatientIdInitialData,
  ScreeningRecommendation
> {
  breastCancerScreeningLibrary: BreastCancerScreeningLibrary;

  constructor(opts: InteractiveFlowContextOptions<PatientIdInitialData>) {
    super(opts);
    const { patientId } = opts.interactiveFlowState.initialData;
    const retriever = new MockFhirBundleRetriever({ bundleId: patientId });
    this.breastCancerScreeningLibrary = new BreastCancerScreeningLibrary(
      retriever
    );
  }
}
