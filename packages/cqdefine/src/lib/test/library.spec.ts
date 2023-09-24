import {
  Library,
  ExampleData,
  Define,
  Documentation,
  Params,
} from '../library-decorators';
import { LibraryContainer } from '../library-container';
import { z } from 'zod';
import { FhirLibrary } from '../fhir-library';
import { TernaryEnum } from '@cqlab/cqflow-core';
import { FhirBundleRetriever } from '../retrieval/fhir-bundle-retriever';

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

describe('packagesCqflowEvaluator', () => {
  it('should work', async () => {
    const overAge = z.object({
      age: z.number(),
    });

    type OverAge = z.infer<typeof overAge>;

    const examples = [
      {
        label: 'Example 1',
        data: testDataOne,
      },
    ];

    @Library('HeartDisease')
    @ExampleData(examples)
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
    const registry = libraryContainer.getRegistry();

    const bundleRetriever = new FhirBundleRetriever({ bundle: testDataOne });

    const executor = libraryContainer.getLogic(
      'HeartDiseaseLibrary',
      'isMale',
      bundleRetriever
    );

    const result = await executor.execute();

    expect(result).toEqual(TernaryEnum.TRUE);
  });
});
