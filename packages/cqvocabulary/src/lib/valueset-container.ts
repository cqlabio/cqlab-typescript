import { IndexedValueSet } from './indexed-valueset';

export class ValueSetContainer {
  valuesets: Record<string, IndexedValueSet> = {};

  addValueset(vs: fhir4.ValueSet) {
    const valuesetWrapper = new IndexedValueSet(vs);
    this.valuesets[valuesetWrapper.getId()] = valuesetWrapper;
  }

  getValuesetById(id: string): IndexedValueSet {
    return this.valuesets[id];
  }
}
