import { ValueSetContainer } from './valueset-container';
import { IndexedValueSet } from './indexed-valueset';

export abstract class LazyValueSetContainer {
  valuesets: Record<string, IndexedValueSet> = {};

  abstract loadValuesetById(id: string): Promise<IndexedValueSet>;

  async getValuesetById(id: string): Promise<IndexedValueSet> {
    if (this.valuesets[id]) {
      return this.valuesets[id];
    }

    const loadedValueset = await this.loadValuesetById(id);
    return loadedValueset;
  }

  getAllLoadedValueSets(): IndexedValueSet[] {
    return Object.values(this.valuesets);
  }
}
