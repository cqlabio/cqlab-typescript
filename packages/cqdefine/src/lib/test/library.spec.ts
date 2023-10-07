import {
  Library,
  MockData,
  Define,
  Documentation,
  Params,
} from '../library-decorators';
import { LibraryContainer } from '../library-container';
import { z } from 'zod';
import { FhirLibrary } from '../fhir-library';
import { TernaryEnum } from '@cqlab/cqflow-core';
import { LazyFhirBundleRetriever } from '../retrieval/lazy-fhir-bundle-retriever';

const testDataOne: fhir4.Bundle = {
  resourceType: 'Bundle',
  type: 'collection',
  entry: [
    {
      resource: {
        resourceType: 'Patient',
        gender: 'male',
      },
    },
  ],
};

class TestBundleRetriever extends LazyFhirBundleRetriever {
  async loadPatientBundle(): Promise<fhir4.Bundle> {
    return testDataOne;
  }
}

const overAge = z.object({
  age: z.number(),
});

type OverAge = z.infer<typeof overAge>;

const mockData = [
  {
    label: 'Example 1',
    id: 'Example 1',
  },
];

@Library('Heart Disease')
@MockData(mockData)
class HeartDiseaseLibrary extends FhirLibrary {
  @Define('Is Male')
  @Documentation('Determines if gender is male')
  isMale(): TernaryEnum {
    return TernaryEnum.TRUE;
  }

  @Define('Is Over Age')
  @Documentation('Determines if over a certain age')
  @Params(overAge)
  isOverAge(args: OverAge): TernaryEnum {
    console.log('being accessed');
    return TernaryEnum.TRUE;
  }
}

const libraryContainer = new LibraryContainer();

libraryContainer.add(HeartDiseaseLibrary);

describe('packagesCqflowEvaluator', () => {
  it('should validate the registry', async () => {
    const registry = libraryContainer.getRegistry();

    expect(registry['HeartDiseaseLibrary'].label).toEqual('Heart Disease');
    expect(registry['HeartDiseaseLibrary'].className).toEqual(
      'HeartDiseaseLibrary'
    );
    expect(registry['HeartDiseaseLibrary'].mockData).toEqual(mockData);
    expect(
      registry['HeartDiseaseLibrary'].definitions['isMale'].funcName
    ).toEqual('isMale');
    expect(
      registry['HeartDiseaseLibrary'].definitions['isMale'].documentation
    ).toEqual('Determines if gender is male');
    expect(registry['HeartDiseaseLibrary'].definitions['isMale'].label).toEqual(
      'Is Male'
    );
    // expect(registry['HeartDiseaseLibrary'].definitions['isMale'].returnType).toEqual('Is Male')
  });

  it('should execute the library', async () => {
    const bundleRetriever = new TestBundleRetriever({ bundleId: 'test' });

    const executor = libraryContainer.getLogic(
      'HeartDiseaseLibrary',
      'isMale',
      bundleRetriever
    );

    const result = await executor.execute();

    expect(result).toEqual(TernaryEnum.TRUE);
  });
});
