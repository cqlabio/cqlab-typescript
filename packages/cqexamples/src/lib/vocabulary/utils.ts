import { IndexedValueSet } from '@cqlab/cqvocabulary';

export function getRandomCodeFromValueSet(
  valueSet: IndexedValueSet
): fhir4.Coding {
  const codes = valueSet.getAllCodes();
  if (codes.length === 0) {
    throw new Error("Value set doesn't contain any codes");
  }
  return codes[Math.floor(Math.random() * codes.length)];
}

export function codeableConceptFromCoding(
  coding: fhir4.Coding
): fhir4.CodeableConcept {
  return {
    coding: [coding],
    text: coding.display,
  };
}
