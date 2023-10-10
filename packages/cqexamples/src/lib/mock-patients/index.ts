import { PatientContainer } from './patient-container';
import { createEmptyPatient } from './patients/empty-patient';
import { createPatientThatNeedsBreastCancerScreening } from './patients/patient-needs-breast-cancer-screening';

export enum MockPatientIdEnum {
  empty_data = 'empty_data',
  needs_breast_cancer_screening = 'needs_breast_cancer_screening',
}

export const testDataGenerators: Record<
  MockPatientIdEnum,
  (id: string) => Promise<fhir4.Bundle>
> = {
  [MockPatientIdEnum.empty_data]: createEmptyPatient,

  [MockPatientIdEnum.needs_breast_cancer_screening]:
    createPatientThatNeedsBreastCancerScreening,
};

export const mockDataContainer = new PatientContainer();
