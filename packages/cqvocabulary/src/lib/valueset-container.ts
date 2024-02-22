import { IndexedValueSet } from './indexed-valueset';

export class ValueSetContainer {
  valuesets: Record<string, IndexedValueSet> = {};

  addValueSet(vs: IndexedValueSet) {
    this.valuesets[vs.getId()] = vs;
  }

  getValueSetById(id: string): IndexedValueSet {
    return this.valuesets[id];
  }

  getAllValueSets(): IndexedValueSet[] {
    return Object.values(this.valuesets);
  }
}
