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
import { whoImmunizationImplementation } from './who-immunization/who-immunization';
import { WHOImmunizationContext } from './who-immunization/who-immunization-context';
import { whoImmunizationHepatitisBImplementation } from './who-immunization/who-immunixation-hepatitis-b';
import { WHOImmunizationHepBContext } from './who-immunization/hepatitis-b-context';

export const enum ExampleFlowDefinitionIdEnum {
  docs_breast_cancer_screening = 'docs-breast-cancer-screening',
  docs_breast_cancer_screening_non_interactive = 'docs-breast-cancer-screening-non-interactive',
  docs_hypertension = 'docs-hypertension',
  who_immunization = 'who-immunization',
  who_immunization_hepatitis_b = 'who-immunization-hepatitis-b',
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

flowRepository.registerInteractiveModule<PatientIdInitialData>(
  ExampleFlowDefinitionIdEnum.who_immunization,
  {
    flowImplementation: whoImmunizationImplementation,
    flowContext: (contextOpts) => new WHOImmunizationContext(contextOpts),
    testData: [
      {
        patientId: MockPatientIdEnum.empty_data,
      },
    ],
  }
);

flowRepository.registerInteractiveModule<PatientIdInitialData>(
  ExampleFlowDefinitionIdEnum.who_immunization_hepatitis_b,
  {
    flowImplementation: whoImmunizationHepatitisBImplementation,
    flowContext: (contextOpts) => new WHOImmunizationHepBContext(contextOpts),
    testData: [
      {
        patientId: MockPatientIdEnum.empty_data,
      },
    ],
  }
);
