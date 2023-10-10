import { FhirR4 } from '@cqlab/cqmockdata';

export async function createEmptyPatient(
  patientId: string
): Promise<fhir4.Bundle> {
  const bundle: fhir4.Bundle = {
    resourceType: 'Bundle',
    type: 'document',
    id: patientId,
    entry: [],
  };

  let patient = FhirR4.patientCreate(bundle.id as string);
  patient = FhirR4.patientWithName(patient, 'Jane', 'Doe');
  FhirR4.bundleAddEntry(bundle, patient);

  return bundle;
}
