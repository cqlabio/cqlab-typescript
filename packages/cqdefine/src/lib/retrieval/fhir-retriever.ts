import { BaseRetriever } from './base-retriever';

export interface FHIRRetriever extends BaseRetriever {
  getPatient(): Promise<fhir4.Patient>;

  getObservationsByCode(searchCode: fhir4.Coding): Promise<fhir4.Observation[]>;
}
