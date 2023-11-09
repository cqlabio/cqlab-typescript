import { z } from 'zod';
import dayjs from 'dayjs';
import { TernaryEnum } from '@cqlab/cqflow-core';
import {
  Library,
  Define,
  Documentation,
  ReturnType,
  MockData,
  FhirLibrary,
  Params,
} from '@cqlab/cqdefine';
import { MockPatientIdEnum } from '../mock-patients';

const makeMockDataItem = (id: MockPatientIdEnum) => ({ id: id, label: id });

// Declare a schema using zod to document and validate a return type
const ageSchema = z.number().int().positive().min(0);
type Age = z.infer<typeof ageSchema>;

// The @Library decorator marks the class as a Library and defines the library name
// The optional @MockData decorator binds mock data items to the library for testing
@Library('BasicRetrieveLibrary')
@MockData([
  makeMockDataItem(MockPatientIdEnum.empty_data),
  makeMockDataItem(MockPatientIdEnum.needs_breast_cancer_screening),
])
export class BasicRetrieveLibrary extends FhirLibrary {
  // The @Define decorator exposes the function as a public interface
  // The @Documentation decorator is used to surface documentation
  // Without a @ReturnType decorator, the expected return type defaults to a TernaryEnum
  @Define('Is female')
  @Documentation('Determines if gender is female')
  async isFemale(): Promise<TernaryEnum> {
    const patient = await this.retriever.getPatient();
    if (!patient.gender) {
      return TernaryEnum.UNKNOWN;
    }

    return patient.gender === 'female' ? TernaryEnum.TRUE : TernaryEnum.FALSE;
  }

  // The @ReturnType allows for arbitrary values to be returned
  // It takes a Zod schema which is used for validation
  // and to return a json schema to calling API services
  @Define("Get patient's age in years")
  @ReturnType(ageSchema)
  async getPatientAgeInYears(): Promise<Age | null> {
    const patient = await this.retriever.getPatient();

    if (!patient.birthDate) {
      return null;
    }

    const birthDate = dayjs(patient.birthDate);
    return dayjs().diff(birthDate, 'years');
  }

  // We use the results of getPatientAgeInYears() to return a TernaryEnum
  // This allows us to expose information at different levels based on the needs
  // of the consuming application
  @Define('Is over 18 years old')
  @Documentation('Determines if patient is over 18')
  async isOver18(): Promise<TernaryEnum> {
    const ageInYears = await this.getPatientAgeInYears();

    if (ageInYears === null) {
      return TernaryEnum.UNKNOWN;
    }

    return ageInYears >= 18 ? TernaryEnum.TRUE : TernaryEnum.FALSE;
  }
}
