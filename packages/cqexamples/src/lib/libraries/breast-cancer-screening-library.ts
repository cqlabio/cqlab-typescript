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

// The @Library decorator marks the class as a Library and defines the library name
// The optional @MockData decorator binds mock data items to the library for testing
@Library('Breast Cancer Screening Library')
@MockData([
  makeMockDataItem(MockPatientIdEnum.empty_data),
  makeMockDataItem(MockPatientIdEnum.needs_breast_cancer_screening),
])
export class BreastCancerScreeningLibrary extends FhirLibrary {
  // The @Define decorator exposes the function as a public interface
  // The @Documentation decorator is used for documentation generation
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
    const valueSet = await valueSetContainer.loadValuesetById(
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

    return procedureFilteredByDate.length >= 0
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }
}
