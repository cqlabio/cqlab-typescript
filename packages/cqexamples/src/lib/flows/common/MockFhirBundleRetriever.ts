import { LazyFhirBundleRetriever } from '@cqlab/cqdefine';
import { Bundle, FhirResource } from 'fhir/r4';
import { mockDataContainer } from '../../mock-patients';

export class MockFhirBundleRetriever extends LazyFhirBundleRetriever {
  override async loadPatientBundle(
    bundleId: string
  ): Promise<Bundle<FhirResource>> {
    const bundle = await mockDataContainer.loadMockData(bundleId);
    if (!bundle) {
      throw new Error('Unable to find bundle for patient: ' + bundleId);
    }
    return bundle;
  }
}
