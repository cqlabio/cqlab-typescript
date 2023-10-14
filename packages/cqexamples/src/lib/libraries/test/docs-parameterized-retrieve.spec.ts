import { MockPatientIdEnum } from '../../mock-patients';
import { ParameterizedRetrieveLibrary } from '../docs-parameterized-retrieve';
import { MockFhirBundleRetriever } from '../../flows/common/MockFhirBundleRetriever';
import { TernaryEnum } from '@cqlab/cqflow-core';

describe('DocsParameterizedRetrieve', () => {
  it('should get calculate high blood pressure', async () => {
    // Patient has score of 220
    const retriever = new MockFhirBundleRetriever({
      bundleId: MockPatientIdEnum.high_cholesterol,
    });

    const breastCancerScreeningLibrary = new ParameterizedRetrieveLibrary(
      retriever
    );

    const paramResult1 =
      await breastCancerScreeningLibrary.isCholesterolAboveThreshold(210);
    expect(paramResult1).toEqual(TernaryEnum.TRUE);

    const paramResult2 =
      await breastCancerScreeningLibrary.isCholesterolAboveThreshold(230);
    expect(paramResult2).toEqual(TernaryEnum.FALSE);

    const highResult =
      await breastCancerScreeningLibrary.isCholesterolReadingAbove200();
    expect(highResult).toEqual(TernaryEnum.TRUE);
  });
});
