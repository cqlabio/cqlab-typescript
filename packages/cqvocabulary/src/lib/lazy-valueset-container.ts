import { ValueSetContainer } from './valueset-container';
import { IndexedValueSet } from './indexed-valueset';

export abstract class LazyValueSetContainer {
  valuesets: Record<string, IndexedValueSet> = {};

  abstract loadValueSetById(id: string): Promise<IndexedValueSet>;

  async getValueSetById(id: string): Promise<IndexedValueSet> {
    if (this.valuesets[id]) {
      return this.valuesets[id];
    }

    const loadedValueSet = await this.loadValueSetById(id);
    return loadedValueSet;
  }

  getAllLoadedValueSets(): IndexedValueSet[] {
    return Object.values(this.valuesets);
  }
}
