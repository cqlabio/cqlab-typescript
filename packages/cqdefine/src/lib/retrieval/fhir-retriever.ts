import { BaseRetriever } from './base-retriever';
import { IndexedValueSet } from '@cqlab/cqvocabulary';
export interface FHIRRetriever extends BaseRetriever {
  getPatient(): Promise<fhir4.Patient>;

  getResourcesByValueSet<R extends fhir4.Resource>(
    valueSet: IndexedValueSet,
    resourceType: string,
    getFilterCode: (resource: R) => fhir4.CodeableConcept | undefined
  ): Promise<R[]>;

  getObservationsByCode(searchCode: fhir4.Coding): Promise<fhir4.Observation[]>;
  getConditionsByCode(searchCode: fhir4.Coding): Promise<fhir4.Condition[]>;
  getProceduresByCode(searchCode: fhir4.Coding): Promise<fhir4.Procedure[]>;
  getMedicationDispensesByCode(
    searchCode: fhir4.Coding
  ): Promise<fhir4.MedicationDispense[]>;
  getEncountersByCode(searchCode: fhir4.Coding): Promise<fhir4.Encounter[]>;

  getObservationsByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.Observation[]>;
  getConditionsByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.Condition[]>;
  getProceduresByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.Procedure[]>;
  getMedicationDispensesByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.MedicationDispense[]>;
  getEncountersByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.Encounter[]>;
}
