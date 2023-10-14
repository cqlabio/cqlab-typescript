export function codeableConceptFromCoding(
  coding: fhir4.Coding
): fhir4.CodeableConcept {
  return {
    coding: [coding],
    text: coding.display,
  };
}
