import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

function bundleAddEntry(bundle: fhir4.Bundle, resource: fhir4.FhirResource) {
  if (bundle.entry && resource) {
    bundle.entry.push({
      resource: resource,
    });
  }
}

function patientCreate(bundleId: string): fhir4.Patient {
  const patient: fhir4.Patient = {
    resourceType: 'Patient',
    id: `Patient/${bundleId}`,
  };

  return patient;
}

function patientWithName(
  patient: fhir4.Patient,
  first: string,
  last: string
): fhir4.Patient {
  return {
    ...patient,
    name: [
      {
        family: last,
        given: [first],
      },
    ],
  };
}

function patientWithBirthDate(
  patient: fhir4.Patient,
  birthDate: dayjs.Dayjs
): fhir4.Patient {
  return {
    ...patient,
    birthDate: birthDate.toISOString().split('T')[0],
  };
}

function patientWithGender(
  patient: fhir4.Patient,
  gender: 'male' | 'female'
): fhir4.Patient {
  return {
    ...patient,
    gender: gender,
  };
}

function procedureCreate(
  patient: fhir4.Patient,
  procedureCode: fhir4.CodeableConcept
): fhir4.Procedure {
  const proc: fhir4.Procedure = {
    resourceType: 'Procedure',
    id: uuidv4(),
    status: 'completed',
    code: procedureCode,
    subject: {
      reference: patient.id,
    },
  };

  return proc;
}

function procedureWithPerformedDateTime(
  proc: fhir4.Procedure,
  performedDateTime: string
): fhir4.Procedure {
  return {
    ...proc,
    performedDateTime: performedDateTime,
  };
}

function conditionCreate(
  patient: fhir4.Patient,
  conditionCode: fhir4.CodeableConcept
): fhir4.Condition {
  const condition: fhir4.Condition = {
    resourceType: 'Condition',
    id: uuidv4(),
    code: conditionCode,
    subject: {
      reference: patient.id,
    },
  };

  return condition;
}

function immunizationCreate(
  patient: fhir4.Patient,
  vaccineCode: fhir4.CodeableConcept
): fhir4.Immunization {
  const imm: fhir4.Immunization = {
    resourceType: 'Immunization',
    id: uuidv4(),
    status: 'completed',
    vaccineCode: vaccineCode,
    patient: {
      reference: patient.id,
    },
  };

  return imm;
}

function immunizationWithOccurrenceDateTime(
  immunization: fhir4.Immunization,
  occurrenceDateTime: string
): fhir4.Immunization {
  return {
    ...immunization,
    occurrenceDateTime: occurrenceDateTime,
  };
}

function observationCreate(
  patient: fhir4.Patient,
  code: fhir4.CodeableConcept
): fhir4.Observation {
  const imm: fhir4.Observation = {
    resourceType: 'Observation',
    id: uuidv4(),
    status: 'final',
    code: code,
    subject: {
      reference: patient.id,
    },
  };

  return imm;
}

function observationAddValueQuantity(
  observation: fhir4.Observation,
  quantity: fhir4.Quantity
): fhir4.Observation {
  return {
    ...observation,
    valueQuantity: quantity,
  };
}

function observationAddComponent(
  observation: fhir4.Observation,
  component: fhir4.ObservationComponent
): fhir4.Observation {
  return {
    ...observation,
    component: observation.component
      ? [...observation.component, component]
      : [component],
  };
}

function observationValueComponentCreate(
  code: fhir4.CodeableConcept
): fhir4.ObservationComponent {
  return {
    code: code,
  };
}

function observationComponentAddValueQuantity(
  component: fhir4.ObservationComponent,
  quantity: fhir4.Quantity
): fhir4.ObservationComponent {
  return {
    ...component,
    valueQuantity: quantity,
  };
}

function observationAddEffectiveDateTime(
  observation: fhir4.Observation,
  effectiveDateTime: string
): fhir4.Observation {
  return {
    ...observation,
    effectiveDateTime: effectiveDateTime,
  };
}

function medicationDispenseCreate(
  patient: fhir4.Patient,
  code: fhir4.CodeableConcept
): fhir4.MedicationDispense {
  const medication: fhir4.MedicationDispense = {
    resourceType: 'MedicationDispense',
    id: uuidv4(),
    status: 'completed',
    medicationCodeableConcept: code,
    subject: {
      reference: patient.id,
    },
  };

  return medication;
}

function codeableConceptCreate(
  code: string,
  system: string
): fhir4.CodeableConcept {
  const cc: fhir4.CodeableConcept = {
    coding: [
      {
        code: code,
        system: system,
      },
    ],
  };

  return cc;
}

function createQuantity(value: number, unit: string): fhir4.Quantity {
  return {
    value: value,
    unit: unit,
    system: 'http://unitsofmeasure.org',
    code: unit,
  };
}

export const FhirR4 = {
  bundleAddEntry,
  patientCreate,
  patientWithName,
  patientWithBirthDate,
  patientWithGender,
  procedureCreate,
  procedureWithPerformedDateTime,
  conditionCreate,
  immunizationCreate,
  immunizationWithOccurrenceDateTime,
  observationCreate,
  observationAddValueQuantity,
  observationAddEffectiveDateTime,
  observationAddComponent,
  observationValueComponentCreate,
  observationComponentAddValueQuantity,
  medicationDispenseCreate,
  codeableConceptCreate,
  createQuantity,
};
