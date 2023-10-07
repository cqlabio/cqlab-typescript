import { ValueSetContainer } from './valueset-container';

export class Vocabulary {
  valueSetContainer: ValueSetContainer;

  constructor(valueSetContainer: ValueSetContainer) {
    this.valueSetContainer = valueSetContainer;
  }
}
