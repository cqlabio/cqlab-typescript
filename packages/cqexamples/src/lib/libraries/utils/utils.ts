import dayjs from 'dayjs';

export function sortObservations(
  observations: fhir4.Observation[]
): fhir4.Observation[] {
  return observations.sort((a, b) => {
    if (a.effectiveDateTime && b.effectiveDateTime) {
      return dayjs(a.effectiveDateTime).isBefore(dayjs(b.effectiveDateTime))
        ? -1
        : 1;
    }
    return 0;
  });
}

export function codingInCodeableConcept(
  coding: fhir4.Coding,
  codeableConcept: fhir4.CodeableConcept | null
) {
  if (!codeableConcept) {
    return false;
  }

  return codeableConcept.coding?.some(
    (c) => c.code === coding.code && c.system === coding.system
  );
}
