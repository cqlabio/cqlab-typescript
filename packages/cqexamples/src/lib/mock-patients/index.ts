import { PatientContainer } from './patient-container';
import { createEmptyPatient } from './patients/empty-patient';
import { createPatientThatNeedsBreastCancerScreening } from './patients/patient-needs-breast-cancer-screening';
import { createPatientScheduleBreastCancerScreening } from './patients/patient-schedule-breast-cancer-screening';
import {
  createHypertensionNormal,
  createHypertensionStage2,
  createHypertensiveCrisis,
} from './patients/hypertension/all-patients';
import { createHighCholesterol } from './patients/high-cholesterol';

export enum MockPatientIdEnum {
  empty_data = 'empty_data',
  needs_breast_cancer_screening = 'needs_breast_cancer_screening',
  schedule_breast_caner_screening = 'schedule_breast_caner_screening',
  hypertension_crisis = 'hypertension_crisis',
  hypertension_stage_2 = 'hypertension_stage_2',
  hypertension_none = 'hypertension_none',
  high_cholesterol = 'high_cholesterol',
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

  [MockPatientIdEnum.hypertension_crisis]: createHypertensiveCrisis,
  [MockPatientIdEnum.hypertension_stage_2]: createHypertensionStage2,
  [MockPatientIdEnum.high_cholesterol]: createHighCholesterol,

  [MockPatientIdEnum.hypertension_none]: createHypertensionNormal,
};

export const mockDataContainer = new PatientContainer();
