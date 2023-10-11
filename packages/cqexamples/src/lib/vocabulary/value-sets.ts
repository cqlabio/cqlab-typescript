import { IndexedValueSet, LazyValueSetContainer } from '@cqlab/cqvocabulary';

import mammography from './value-sets/mammography.json';

export enum ValueSetIdEnum {
  mammography = 'mammography',
}

const valueSetLookup: Record<ValueSetIdEnum, fhir4.ValueSet> = {
  [ValueSetIdEnum.mammography]: mammography as fhir4.ValueSet,
};

class ExampleValueSetContainer extends LazyValueSetContainer {
  async loadValuesetById(id: string): Promise<IndexedValueSet> {
    const valueSet = valueSetLookup[id as ValueSetIdEnum];
    if (!valueSet) {
      throw new Error(`Value set ${id} not found`);
    }
    return new IndexedValueSet(valueSet);
  }
}

export const valueSetContainer = new ExampleValueSetContainer();
