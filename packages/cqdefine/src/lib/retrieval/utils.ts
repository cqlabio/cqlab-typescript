export function doCodingsMatch(
  coding1: fhir4.Coding,
  coding2: fhir4.Coding
): boolean {
  return coding1.system === coding2.system && coding1.code === coding2.code;
}

export function isCodingInCodeableConcept(
  searchCoding: fhir4.Coding,
  codeableConcept: fhir4.CodeableConcept | null
): boolean {
  const codings = codeableConcept?.coding || [];
  for (const coding of codings) {
    if (doCodingsMatch(searchCoding, coding)) {
      return true;
    }
  }

  return false;
}

// export function isSearchCodeInCodeableConcept(
//   searchCode: fhir4.Coding,
//   codeableConcept: fhir4.CodeableConcept | null
// ): boolean {
//   return isCodingInCodeableConcept(
//     searchCode,
//     codeableConcept
//   );
// }
