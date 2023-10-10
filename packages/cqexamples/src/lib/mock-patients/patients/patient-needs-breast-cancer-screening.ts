import * as dayjs from 'dayjs';
import { FhirR4 } from '@cqlab/cqmockdata';

export async function createPatientThatNeedsBreastCancerScreening(
  patientId: string
): Promise<fhir4.Bundle> {
  const bundle: fhir4.Bundle = {
    resourceType: 'Bundle',
    type: 'document',
    id: patientId,
    entry: [],
  };

  let patient = FhirR4.patientCreate(bundle.id as string);
  patient = FhirR4.patientWithName(patient, 'Jan', 'Smith');
  patient = FhirR4.patientWithGender(patient, 'female');
  patient = FhirR4.patientWithBirthDate(patient, dayjs().subtract(50, 'years'));

  FhirR4.bundleAddEntry(bundle, patient);

  return bundle;
}
