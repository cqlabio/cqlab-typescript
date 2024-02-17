import { FlowContext, FlowContextOpts } from '@cqlab/cqflow-core';
import { MockFhirBundleRetriever } from '../../common/MockFhirBundleRetriever';
import { BreastCancerScreeningLibrary } from '../../../libraries/breast-cancer-screening-library';

// Define the initialization data structure
interface PatientIdInitialData {
  patientId: string;
}

// Define the expected output data structure
interface ScreeningRecommendation {
  recommendation: string;
}

// Define the interactive flow context
// Attach the breastCancerScreeningLibrary for use in the implementation nodes
// Use the mockBundleRetriever to retrieve the patient data
export class NonInteractiveBreastCancerScreeningContext extends FlowContext<
  PatientIdInitialData,
  ScreeningRecommendation
> {
  breastCancerScreeningLibrary: BreastCancerScreeningLibrary;

  constructor(opts: FlowContextOpts<PatientIdInitialData>) {
    super(opts);
    const { patientId } = opts.initialData;
    const retriever = new MockFhirBundleRetriever({ bundleId: patientId });
    this.breastCancerScreeningLibrary = new BreastCancerScreeningLibrary(
      retriever
    );
  }
}
