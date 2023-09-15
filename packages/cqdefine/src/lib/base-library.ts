import { BaseRetriever } from './retrieval/base-retriever';

export abstract class BaseLibrary<R extends BaseRetriever> {
  retriever: R;

  constructor(retriever: R) {
    this.retriever = retriever;
  }
}
