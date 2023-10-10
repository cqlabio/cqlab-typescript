import { FlowRepository } from '@cqlab/cqflow-core';
import { MockPatientIdEnum } from '../mock-patients/index';
import { PatientIdInitialData } from './common/types';
import {
  breastCancerScreeningImplementation,
  BreastCancerScreeningContext,
} from './docs/breast-cancer-screening-interactive/breast-cancer-screening-interactive';

export const enum ExampleFlowDefinitionIdEnum {
  docs_breast_cancer_screening = 'docs-breast-cancer-screening',
}

export const exampleFlowRepository = new FlowRepository();

exampleFlowRepository.registerInteractiveModule<PatientIdInitialData>(
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
    ],
  }
);
