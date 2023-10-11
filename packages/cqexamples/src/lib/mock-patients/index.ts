import { PatientContainer } from './patient-container';
import { createEmptyPatient } from './patients/empty-patient';
import { createPatientThatNeedsBreastCancerScreening } from './patients/patient-needs-breast-cancer-screening';
import { createPatientScheduleBreastCancerScreening } from './patients/patient-schedule-breast-cancer-screening';

export enum MockPatientIdEnum {
  empty_data = 'empty_data',
  needs_breast_cancer_screening = 'needs_breast_cancer_screening',
  schedule_breast_caner_screening = 'schedule_breast_caner_screening',
}

export const testDataGenerators: Record<
  MockPatientIdEnum,
  (id: string) => Promise<fhir4.Bundle>
> = {
  [MockPatientIdEnum.empty_data]: createEmptyPatient,

  [MockPatientIdEnum.needs_breast_cancer_screening]:
    createPatientThatNeedsBreastCancerScreening,

  [MockPatientIdEnum.schedule_breast_caner_screening]:
    createPatientScheduleBreastCancerScreening,
};

export const mockDataContainer = new PatientContainer();
