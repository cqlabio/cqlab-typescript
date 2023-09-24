import {
  isCodingInCodeableConcept,
  isCodeableConceptInValueSet,
} from './utils';
import { FHIRRetriever } from './fhir-retriever';
import { IndexedValueSet } from '@cqlab/cqvocabulary';

export type ResourceTypes =
  | 'Patient'
  | 'Observation'
  | 'MedicationDispense'
  | 'Condition'
  | 'Procedure'
  | 'Encounter';

export interface BundleRetrieverOpts {
  bundle: fhir4.Bundle;
}

const GetObservationCode = (resource: fhir4.Observation) => resource.code;
const GetMedicationDispenseCode = (resource: fhir4.MedicationDispense) =>
  resource.medicationCodeableConcept;
const GetConditionCode = (resource: fhir4.Condition) => resource.code;
const GetProcedureCode = (resource: fhir4.Procedure) => resource.code;
const GetEncounterCode = (resource: fhir4.Encounter) => resource.type;

export class FhirBundleRetriever implements FHIRRetriever {
  bundle: fhir4.Bundle;

  constructor(opts: BundleRetrieverOpts) {
    this.bundle = opts.bundle;
  }

  async getPatientBundle(): Promise<fhir4.Bundle> {
    return this.bundle;
  }

  async getPatient(): Promise<fhir4.Patient> {
    const bundle = await this.getPatientBundle();

    const patient = bundle.entry?.find(
      (entry) => entry.resource?.resourceType === 'Patient'
    )?.resource as fhir4.Patient;

    if (!patient) {
      throw new Error('Patient resource not found in bundle');
    }
    return patient;
  }

  async getResourcesByCode<R extends fhir4.Resource>(
    searchCode: fhir4.Coding,
    resourceType: ResourceTypes,
    getFilterCode: (
      resource: R
    ) => fhir4.CodeableConcept | fhir4.CodeableConcept[] | undefined
  ) {
    const bundle = await this.getPatientBundle();

    return (
      bundle.entry
        ?.filter((entry) => {
          const { resource } = entry;
          if (!resource || resource.resourceType !== resourceType) {
            return false;
          }
          let filterCodes = getFilterCode(resource as R);
          if (!filterCodes) {
            return false;
          }
          if (!Array.isArray(filterCodes)) {
            filterCodes = [filterCodes];
          }
          return filterCodes.some((filterCode) => {
            return isCodingInCodeableConcept(searchCode, filterCode);
          });
        })
        .map((entry) => entry.resource as R) || []
    );
  }

  async getResourcesByValueSet<R extends fhir4.Resource>(
    valueSet: IndexedValueSet,
    resourceType: ResourceTypes,
    getFilterCode: (
      resource: R
    ) => fhir4.CodeableConcept | fhir4.CodeableConcept[] | undefined
  ) {
    const bundle = await this.getPatientBundle();

    return (
      bundle.entry
        ?.filter((entry) => {
          const { resource } = entry;
          if (!resource || resource.resourceType !== resourceType) {
            return false;
          }

          let filterCodes = getFilterCode(resource as R);
          if (!filterCodes) {
            return false;
          }
          if (!Array.isArray(filterCodes)) {
            filterCodes = [filterCodes];
          }
          return filterCodes.some((filterCode) => {
            return isCodeableConceptInValueSet(filterCode, valueSet);
          });
        })
        .map((entry) => entry.resource as R) || []
    );
  }

  async getObservationsByCode(
    searchCode: fhir4.Coding
  ): Promise<fhir4.Observation[]> {
    return this.getResourcesByCode<fhir4.Observation>(
      searchCode,
      'Observation',
      GetObservationCode
    );
  }

  async getConditionsByCode(
    searchCode: fhir4.Coding
  ): Promise<fhir4.Condition[]> {
    return this.getResourcesByCode<fhir4.Condition>(
      searchCode,
      'Condition',
      GetConditionCode
    );
  }

  async getProceduresByCode(
    searchCode: fhir4.Coding
  ): Promise<fhir4.Procedure[]> {
    return this.getResourcesByCode<fhir4.Procedure>(
      searchCode,
      'Procedure',
      GetProcedureCode
    );
  }

  async getMedicationDispensesByCode(
    searchCode: fhir4.Coding
  ): Promise<fhir4.MedicationDispense[]> {
    return this.getResourcesByCode<fhir4.MedicationDispense>(
      searchCode,
      'MedicationDispense',
      GetMedicationDispenseCode
    );
  }

  async getEncountersByCode(
    searchCode: fhir4.Coding
  ): Promise<fhir4.Encounter[]> {
    return this.getResourcesByCode<fhir4.Encounter>(
      searchCode,
      'Encounter',
      GetEncounterCode
    );
  }

  async getObservationsByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.Observation[]> {
    return this.getResourcesByValueSet<fhir4.Observation>(
      valueSet,
      'Observation',
      GetObservationCode
    );
  }

  async getConditionsByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.Condition[]> {
    return this.getResourcesByValueSet<fhir4.Condition>(
      valueSet,
      'Condition',
      GetConditionCode
    );
  }

  async getProceduresByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.Procedure[]> {
    return this.getResourcesByValueSet<fhir4.Procedure>(
      valueSet,
      'Procedure',
      GetProcedureCode
    );
  }

  async getMedicationDispensesByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.MedicationDispense[]> {
    return this.getResourcesByValueSet<fhir4.MedicationDispense>(
      valueSet,
      'MedicationDispense',
      GetMedicationDispenseCode
    );
  }

  async getEncountersByValueSet(
    valueSet: IndexedValueSet
  ): Promise<fhir4.Encounter[]> {
    return this.getResourcesByValueSet<fhir4.Encounter>(
      valueSet,
      'Encounter',
      GetEncounterCode
    );
  }
}
