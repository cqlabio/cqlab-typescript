import { FhirR4 } from '@cqlab/cqmockdata';
import {
  ExampleCodings,
  ExampleCodingsEnum,
} from '../../../vocabulary/codings';
import { codeableConceptFromCoding } from '../../../vocabulary/utils';

function createPatient(patientId: string, systolic: number, diastolic: number) {
  const bundle: fhir4.Bundle = {
    resourceType: 'Bundle',
    type: 'document',
    id: patientId,
    entry: [],
  };

  let patient = FhirR4.patientCreate(bundle.id as string);
  patient = FhirR4.patientWithName(patient, 'Jane', 'Doe');
  FhirR4.bundleAddEntry(bundle, patient);

  const panelCode = ExampleCodings[ExampleCodingsEnum.blood_pressure_panel];
  let observation = FhirR4.observationCreate(
    patient,
    codeableConceptFromCoding(panelCode)
  );

  const systolicCode =
    ExampleCodings[ExampleCodingsEnum.systolic_blood_pressure];
  let systolicReading = FhirR4.observationValueComponentCreate(
    codeableConceptFromCoding(systolicCode)
  );
  systolicReading = FhirR4.observationComponentAddValueQuantity(
    systolicReading,
    FhirR4.createQuantity(systolic, 'mmHg')
  );

  const diastolicCode =
    ExampleCodings[ExampleCodingsEnum.diastolic_blood_pressure];
  let diastolicReading = FhirR4.observationValueComponentCreate(
    codeableConceptFromCoding(diastolicCode)
  );
  diastolicReading = FhirR4.observationComponentAddValueQuantity(
    diastolicReading,
    FhirR4.createQuantity(diastolic, 'mmHg')
  );

  observation = FhirR4.observationAddComponent(observation, systolicReading);
  observation = FhirR4.observationAddComponent(observation, diastolicReading);

  FhirR4.bundleAddEntry(bundle, observation);

  return bundle;
}

export async function createHypertensiveCrisis(
  patientId: string
): Promise<fhir4.Bundle> {
  return createPatient(patientId, 181, 100);
}

export async function createHypertensionStage2(
  patientId: string
): Promise<fhir4.Bundle> {
  return createPatient(patientId, 150, 85);
}

export async function createHypertensionNormal(
  patientId: string
): Promise<fhir4.Bundle> {
  return createPatient(patientId, 110, 75);
}
