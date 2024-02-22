import dayjs from 'dayjs';
import { TernaryEnum } from '@cqlab/cqflow-core';
import { MockPatientIdEnum } from '../mock-patients/index';
import {
  Library,
  MockData,
  Define,
  Documentation,
  FhirLibrary,
} from '@cqlab/cqdefine';
import { ValueSetIdEnum, valueSetContainer } from '../vocabulary/value-sets';

const makeMockDataItem = (id: MockPatientIdEnum) => ({ id: id, label: id });

@Library('BreastCancerScreeningLibrary')
@MockData([
  makeMockDataItem(MockPatientIdEnum.empty_data),
  makeMockDataItem(MockPatientIdEnum.needs_breast_cancer_screening),
  makeMockDataItem(MockPatientIdEnum.schedule_breast_caner_screening),
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

  // Each public function should be documented and unit tested
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

  @Define('Has had breast cancer screening in last 2 years')
  @Documentation(
    'Checks for breast cancer screening using the mammography value set'
  )
  async hadBreastCancerScreeningInLast2Years(): Promise<TernaryEnum> {
    const valueSet = await valueSetContainer.loadValueSetById(
      ValueSetIdEnum.mammography
    );
    const procedures = await this.retriever.getProceduresByValueSet(valueSet);

    const twoYearsAgo = dayjs().subtract(2, 'years');

    const procedureFilteredByDate = procedures.filter((procedure) => {
      if (!procedure.performedDateTime) {
        return false;
      }
      const performedDate = dayjs(procedure.performedDateTime);
      return performedDate.isAfter(twoYearsAgo);
    });

    return procedureFilteredByDate.length > 0
      ? TernaryEnum.TRUE
      : TernaryEnum.UNKNOWN;
  }
}
