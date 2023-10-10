import { LazyMockDataContainer } from '@cqlab/cqmockdata';
import { testDataGenerators, MockPatientIdEnum } from './index';

export class PatientContainer extends LazyMockDataContainer<fhir4.Bundle> {
  data: Record<string, fhir4.Bundle> = {};

  async loadMockData(id: string) {
    if (!this.data[id]) {
      const generateBundle = testDataGenerators[id as MockPatientIdEnum];
      if (!generateBundle) {
        throw new Error(`No mock data generator for id: ${id}`);
      }
      this.data[id] = await generateBundle(id);
    }
    return this.data[id];
  }
}
