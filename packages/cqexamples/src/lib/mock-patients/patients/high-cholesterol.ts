import dayjs from 'dayjs';
import { FhirR4 } from '@cqlab/cqmockdata';
import { ExampleCodings, ExampleCodingsEnum } from '../../vocabulary/codings';
import { codeableConceptFromCoding } from '../../vocabulary/utils';

export async function createHighCholesterol(
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

  const cholesterolCode = ExampleCodings[ExampleCodingsEnum.cholesterol_ratio];
  let obs = FhirR4.observationCreate(
    patient,
    codeableConceptFromCoding(cholesterolCode)
  );
  obs = FhirR4.observationAddValueQuantity(
    obs,
    FhirR4.createQuantity(220, 'mg/dL')
  );
  obs = FhirR4.observationAddEffectiveDateTime(
    obs,
    dayjs().subtract(6, 'hours').toISOString()
  );
  FhirR4.bundleAddEntry(bundle, obs);

  return bundle;
}
