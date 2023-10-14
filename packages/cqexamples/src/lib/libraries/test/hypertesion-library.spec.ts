import { MockPatientIdEnum, mockDataContainer } from '../../mock-patients';
import { HypertensionLibrary } from '..//hypertension-library';
import { MockFhirBundleRetriever } from '../../flows/common/MockFhirBundleRetriever';

describe('HypertensionLibrary', () => {
  it('should get the latest blood pressure panel', async () => {
    const retriever = new MockFhirBundleRetriever({
      bundleId: MockPatientIdEnum.hypertension_crisis,
    });

    const breastCancerScreeningLibrary = new HypertensionLibrary(retriever);

    const bloodPressurePanel =
      await breastCancerScreeningLibrary.getBloodPressurePanel();

    expect(bloodPressurePanel?.systolic.value).toEqual(181);
    expect(bloodPressurePanel?.diastolic.value).toEqual(100);
  });
});
