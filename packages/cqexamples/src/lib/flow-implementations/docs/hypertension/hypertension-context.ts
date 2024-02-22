import {
  ICustomFormStep,
  InteractiveFlowContext,
  InteractiveFlowContextOptions,
} from '@cqlab/cqflow-core';
import { MockFhirBundleRetriever } from '../../common/MockFhirBundleRetriever';
import {
  HypertensionLibrary,
  BloodPressurePanel,
} from '../../../libraries/hypertension-library';
import {
  BreastCancerScreeningEnum,
  EnterBloodPressurePanelData,
} from './hypertension';
import { PatientIdInitialData } from '../../common/types';

// Define the initialization data structure

// Define the expected output data structure
interface ScreeningRecommendation {
  recommendation: string;
}

// Define the interactive flow context
// Attach the breastCancerScreeningLibrary for use in the implementation nodes
// Use the mockBundleRetriever to retrieve the patient data
export class HypertensionContext extends InteractiveFlowContext<
  PatientIdInitialData,
  ScreeningRecommendation
> {
  hypertensionLibrary: HypertensionLibrary;

  constructor(opts: InteractiveFlowContextOptions<PatientIdInitialData>) {
    super(opts);
    const { patientId } = opts.interactiveFlowState.initialData;
    const retriever = new MockFhirBundleRetriever({ bundleId: patientId });
    this.hypertensionLibrary = new HypertensionLibrary(retriever);
  }

  // Since this will be called many times by different nodes, cache the result
  async getBloodPressurePanel(): Promise<EnterBloodPressurePanelData | null> {
    const enterPanelStep = (await this.getFlowStepByBindId(
      BreastCancerScreeningEnum.enter_blood_pressure_panel
    )) as ICustomFormStep<EnterBloodPressurePanelData>;

    if (!enterPanelStep) {
      return null;
    }

    // Pull from either evaluated OR manually entered data
    const panelResults =
      enterPanelStep.evaluation?.value || enterPanelStep.answer?.value;

    if (!panelResults?.diastolicReading || !panelResults?.systolicReading) {
      return null;
    }

    return panelResults;
  }
}
