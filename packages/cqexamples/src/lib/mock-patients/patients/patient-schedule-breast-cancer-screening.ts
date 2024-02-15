import dayjs from 'dayjs';
import { FhirR4 } from '@cqlab/cqmockdata';
import { ValueSetIdEnum, valueSetContainer } from '../../vocabulary/value-sets';
import {
  getRandomCodeFromValueSet,
  codeableConceptFromCoding,
} from '../../vocabulary/utils';

export async function createPatientScheduleBreastCancerScreening(
  patientId: string
): Promise<fhir4.Bundle> {
  const bundle: fhir4.Bundle = {
    resourceType: 'Bundle',
    type: 'document',
    id: patientId,
    entry: [],
  };

  let patient = FhirR4.patientCreate(bundle.id as string);
  patient = FhirR4.patientWithName(patient, 'Jill', 'Thomson');
  patient = FhirR4.patientWithGender(patient, 'female');
  patient = FhirR4.patientWithBirthDate(patient, dayjs().subtract(60, 'years'));

  FhirR4.bundleAddEntry(bundle, patient);

  const valueSet = await valueSetContainer.loadValueSetById(
    ValueSetIdEnum.mammography
  );
  const code = getRandomCodeFromValueSet(valueSet);

  let procedure = FhirR4.procedureCreate(
    patient,
    codeableConceptFromCoding(code)
  );
  procedure = FhirR4.procedureWithPerformedDateTime(
    procedure,
    dayjs().subtract(400, 'days').toISOString()
  );

  FhirR4.bundleAddEntry(bundle, procedure);

  return bundle;
}
