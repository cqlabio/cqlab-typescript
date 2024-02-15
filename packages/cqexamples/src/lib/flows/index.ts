import { FlowRepository } from '@cqlab/cqflow-core';
import { MockPatientIdEnum } from '../mock-patients/index';
import { PatientIdInitialData } from './common/types';
import { breastCancerScreeningImplementation } from './docs/breast-cancer-screening-interactive/breast-cancer-screening-interactive';
import { BreastCancerScreeningContext } from './docs/breast-cancer-screening-interactive/breast-cancer-screening-interactive-context';
import {
  nonInteractiveBreastCancerScreeningImplementation,
  NonInteractiveBreastCancerScreeningContext,
} from './docs/breast-cancer-screening-non-interactive/breast-cancer-screening-interactive';
import {
  hypertensionImplementation,
  HypertensionContext,
} from './docs/hypertension/hypertension';

export const enum ExampleFlowDefinitionIdEnum {
  docs_breast_cancer_screening = 'docs-breast-cancer-screening',
  docs_breast_cancer_screening_non_interactive = 'docs-breast-cancer-screening-non-interactive',
  docs_hypertension = 'docs-hypertension',
}

export const flowRepository = new FlowRepository();

flowRepository.registerInteractiveModule<PatientIdInitialData>(
  ExampleFlowDefinitionIdEnum.docs_breast_cancer_screening,
  {
    flowImplementation: breastCancerScreeningImplementation,
    flowContext: (contextOpts) => new BreastCancerScreeningContext(contextOpts),
    testData: [
      {
        patientId: MockPatientIdEnum.empty_data,
      },
      {
        patientId: MockPatientIdEnum.needs_breast_cancer_screening,
      },
      {
        patientId: MockPatientIdEnum.schedule_breast_caner_screening,
      },
    ],
  }
);

flowRepository.registerNonInteractiveModule<PatientIdInitialData>(
  ExampleFlowDefinitionIdEnum.docs_breast_cancer_screening_non_interactive,
  {
    flowImplementation: nonInteractiveBreastCancerScreeningImplementation,
    flowContext: (contextOpts) =>
      new NonInteractiveBreastCancerScreeningContext(contextOpts),
    testData: [
      {
        patientId: MockPatientIdEnum.empty_data,
      },
      {
        patientId: MockPatientIdEnum.needs_breast_cancer_screening,
      },
      {
        patientId: MockPatientIdEnum.schedule_breast_caner_screening,
      },
    ],
  }
);

flowRepository.registerInteractiveModule<PatientIdInitialData>(
  ExampleFlowDefinitionIdEnum.docs_hypertension,
  {
    flowImplementation: hypertensionImplementation,
    flowContext: (contextOpts) => new HypertensionContext(contextOpts),
    testData: [
      {
        patientId: MockPatientIdEnum.empty_data,
      },
      {
        patientId: MockPatientIdEnum.hypertension_crisis,
      },
      {
        patientId: MockPatientIdEnum.hypertension_stage_2,
      },
      {
        patientId: MockPatientIdEnum.hypertension_none,
      },
    ],
  }
);
