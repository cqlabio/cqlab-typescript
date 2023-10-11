import { MockPatientIdEnum, mockDataContainer } from '../../mock-patients';
import { BreastCancerScreeningLibrary } from '../breast-cancer-screening-library';
import { MockFhirBundleRetriever } from '../../flows/common/MockFhirBundleRetriever';
import { TernaryEnum } from '@cqlab/cqflow-core';

describe('BreastCancerScreeningLibrary', () => {
  it('should work for needs_breast_cancer_screening', async () => {
    const retriever = new MockFhirBundleRetriever({
      bundleId: MockPatientIdEnum.needs_breast_cancer_screening,
    });
    const breastCancerScreeningLibrary = new BreastCancerScreeningLibrary(
      retriever
    );

    const isFemale = await breastCancerScreeningLibrary.isFemale();
    const isOver45 = await breastCancerScreeningLibrary.isOver45();
    const hadInLast =
      await breastCancerScreeningLibrary.hadBreastCancerScreeningInLast2Years();

    expect(isFemale).toEqual(TernaryEnum.TRUE);
    expect(isOver45).toEqual(TernaryEnum.TRUE);
    expect(hadInLast).toEqual(TernaryEnum.UNKNOWN);
  });

  it('should work for schedule_breast_caner_screening', async () => {
    const retriever = new MockFhirBundleRetriever({
      bundleId: MockPatientIdEnum.schedule_breast_caner_screening,
    });
    const breastCancerScreeningLibrary = new BreastCancerScreeningLibrary(
      retriever
    );

    const isFemale = await breastCancerScreeningLibrary.isFemale();
    const isOver45 = await breastCancerScreeningLibrary.isOver45();
    const hadInLast =
      await breastCancerScreeningLibrary.hadBreastCancerScreeningInLast2Years();

    expect(isFemale).toEqual(TernaryEnum.TRUE);
    expect(isOver45).toEqual(TernaryEnum.TRUE);
    expect(hadInLast).toEqual(TernaryEnum.TRUE);
  });
});
