import * as dayjs from 'dayjs';
import { TernaryEnum } from '@cqlab/cqflow-core';
import { MockPatientIdEnum } from '../mock-patients/index';
import {
  Library,
  MockData,
  Define,
  Documentation,
  FhirLibrary,
} from '@cqlab/cqdefine';

const makeMockDataItem = (id: MockPatientIdEnum) => ({ id: id, label: id });

@Library('Breast Cancer Screening Library')
@MockData([
  makeMockDataItem(MockPatientIdEnum.empty_data),
  makeMockDataItem(MockPatientIdEnum.needs_breast_cancer_screening),
])
export class BreastCancerScreeningLibrary extends FhirLibrary {
  @Define('Is Female')
  @Documentation('Determines if gender is female')
  async isFemale(): Promise<TernaryEnum> {
    const patient = await this.retriever.getPatient();
    if (!patient.gender) {
      return TernaryEnum.UNKNOWN;
    }

    return patient.gender === 'female' ? TernaryEnum.TRUE : TernaryEnum.FALSE;
  }

  @Define('Is over 45 years old')
  @Documentation('Determines if patient is over 45')
  async isOver45(): Promise<TernaryEnum> {
    const patient = await this.retriever.getPatient();

    if (!patient.birthDate) {
      return TernaryEnum.UNKNOWN;
    }

    const birthDate = dayjs(patient.birthDate);
    const ageInYears = dayjs().diff(birthDate, 'years');
    return ageInYears >= 45 ? TernaryEnum.TRUE : TernaryEnum.FALSE;
  }
}
