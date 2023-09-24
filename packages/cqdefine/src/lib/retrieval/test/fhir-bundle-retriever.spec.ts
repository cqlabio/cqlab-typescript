import { IndexedValueSet } from '@cqlab/cqvocabulary';
import { FhirBundleRetriever } from '../fhir-bundle-retriever';

const valueSet: fhir4.ValueSet = {
  resourceType: 'ValueSet',
  id: 'test',
  status: 'active',
  expansion: {
    timestamp: '2023-09-21T11:23:07.970Z',
    contains: [
      {
        code: '1234',
        system: 'http://loinc.org',
      },
    ],
  },
};

const bundle: fhir4.Bundle = {
  resourceType: 'Bundle',
  type: 'collection',
  entry: [
    {
      resource: {
        resourceType: 'Observation',
        status: 'final',
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '1234',
              display: 'Test',
            },
          ],
        },
      },
    },
    {
      resource: {
        resourceType: 'Observation',
        status: 'final',
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '4567',
              display: 'Test',
            },
          ],
        },
      },
    },
  ],
};

describe('FHIR bundle executor', () => {
  it('should default to a BranchChoice interaction', async () => {
    const vs = new IndexedValueSet(valueSet);
    const retriever = new FhirBundleRetriever({ bundle });

    const observations = await retriever.getObservationsByValueSet(vs);
    expect(observations.length).toBe(1);
    const coding = observations[0].code.coding;
    expect(coding && coding[0].code).toBe('1234');
  });
});
