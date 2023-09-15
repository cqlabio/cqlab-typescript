// import flatten from 'lodash/flatten';
// import { ALL_PATIENTS } from '@roche-cds/packages/patient-generator';
import { isCodingInCodeableConcept } from './utils';
// import {
//   RocheCodingsEnum,
//   isSearchCodeInCodeableConcept,
//   getCodingFromRocheLibrary,
// } from '@roche-cds/packages/vocabulary';
import { FHIRRetriever } from './fhir-retriever';

export type ResourceTypes = 'Patient' | 'Observation';

export interface BundleRetrieverOpts {
  bundle: fhir4.Bundle;
}

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
    getFilterCode: (resource: R) => fhir4.CodeableConcept
  ) {
    const bundle = await this.getPatientBundle();

    return (
      bundle.entry
        ?.filter((entry) => {
          const { resource } = entry;
          if (!resource || resource.resourceType !== resourceType) {
            return false;
          }
          return isCodingInCodeableConcept(
            searchCode,
            getFilterCode(resource as R)
          );
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
      (resource) => resource.code
    );
  }
}
