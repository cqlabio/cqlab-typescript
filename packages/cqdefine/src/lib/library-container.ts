import { BaseLibrary } from './base-library';
import { zodToJsonSchema } from 'zod-to-json-schema';
// import { FHIRRetriever } from './retrieval/fhir-retriever';
import { BaseRetriever } from './retrieval/base-retriever';

type Newable<T> = new (...args: any[]) => T;

export interface MockDataRef {
  id: string;
  label: string;
}

const getElName = (el: string) => el.split(':')[1];

export interface LibraryFunctionRegistry {
  funcName: string;
  label: string;
  documentation?: string;
  params?: any;
  returnType?: any;
}

export interface LibraryRegistry {
  libraryId: string;
  label: string;
  klass: any;
  definitions: Record<string, LibraryFunctionRegistry>;
  mockData?: MockDataRef[];
}

export type LibraryContainerRegistry = Record<string, LibraryRegistry>;

export class LibraryContainer<R extends BaseRetriever = BaseRetriever> {
  private registry: LibraryContainerRegistry = {};

  getRegistry() {
    return this.registry;
  }

  add(target: any): void {
    const foundKeys = Reflect.getOwnMetadataKeys(target);

    const foundLibraryKey = foundKeys.find((key) =>
      key.startsWith('library-id:')
    ) as string | undefined;

    if (!foundLibraryKey) {
      throw new Error('Target is not injectable');
    }

    foundKeys.forEach((key: string) => {
      if (key === foundLibraryKey) {
        return;
      }

      // const libraryId = target.name;
      const libraryId = getElName(foundLibraryKey);

      if (key === 'exampleData') {
        const examples = Reflect.getMetadata(key, target);

        if (!this.registry[libraryId]) {
          this.registry[libraryId] = {
            libraryId: libraryId,
            label: libraryId,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libraryId].mockData) {
          this.registry[libraryId].mockData = [];
        }

        if (examples.exampleData) {
          this.registry[libraryId].mockData?.push(...examples.exampleData);
        }
      }

      if (key.startsWith('statement:')) {
        const statement = Reflect.getMetadata(key, target);

        const funcName = getElName(key);

        if (!this.registry[libraryId]) {
          this.registry[libraryId] = {
            libraryId: libraryId,
            label: libraryId,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libraryId].definitions[funcName]) {
          this.registry[libraryId].definitions[funcName] = {
            funcName,
            label: '',
          };
        }
        this.registry[libraryId].definitions[funcName].label = statement.label;
      }

      // if (key.startsWith('exampleData:')) {
      //   const exampleData = Reflect.getMetadata(key, target);

      //   const funcName = getElName(key);

      //   if (!this.registry[libraryId]) {
      //     this.registry[libraryId] = {
      //       className: target.name,
      //       label: displayName,
      //       definitions: {},
      //       klass: target,
      //     };
      //   }

      //   if (!this.registry[libraryId].definitions[funcName]) {
      //     this.registry[libraryId].definitions[funcName] = {
      //       funcName,
      //       label: '',
      //     };
      //   }

      //   this.registry[libraryId].definitions[funcName].documentation =
      //     documentation.label;
      // }

      if (key.startsWith('documentation:')) {
        const documentation = Reflect.getMetadata(key, target);

        const funcName = getElName(key);

        if (!this.registry[libraryId]) {
          this.registry[libraryId] = {
            libraryId: libraryId,
            label: libraryId,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libraryId].definitions[funcName]) {
          this.registry[libraryId].definitions[funcName] = {
            funcName,
            label: '',
          };
        }

        this.registry[libraryId].definitions[funcName].documentation =
          documentation.label;
      }

      if (key.startsWith('params:')) {
        const params = Reflect.getMetadata(key, target);

        const funcName = getElName(key);

        if (!this.registry[libraryId]) {
          this.registry[libraryId] = {
            libraryId: libraryId,
            label: libraryId,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libraryId].definitions[funcName]) {
          this.registry[libraryId].definitions[funcName] = {
            funcName,
            label: '',
          };
        }

        this.registry[libraryId].definitions[funcName].params = zodToJsonSchema(
          params.schema
        );
      }

      if (key.startsWith('returnType:')) {
        const returnType = Reflect.getMetadata(key, target);

        const funcName = getElName(key);

        if (!this.registry[libraryId]) {
          this.registry[libraryId] = {
            libraryId: libraryId,
            label: libraryId,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libraryId].definitions[funcName]) {
          this.registry[libraryId].definitions[funcName] = {
            funcName,
            label: '',
          };
        }

        this.registry[libraryId].definitions[funcName].returnType =
          zodToJsonSchema(returnType.schema);
      }
    });
  }

  getLogic(libraryName: string, functionName: string, retriever: R) {
    const LibraryKlass = this.registry[libraryName].klass as Newable<
      BaseLibrary<R>
    >;

    const found = this.registry[libraryName].definitions[functionName];

    const instance = new LibraryKlass(retriever);
    return new LogicInstance(instance, found.funcName);
  }
}

class LogicInstance {
  logicLibraryInstance: any;
  funcName: string;

  constructor(logicLibraryInstance: any, funcName: string) {
    this.logicLibraryInstance = logicLibraryInstance;
    this.funcName = funcName;
  }

  async execute(params?: any) {
    return this.logicLibraryInstance[this.funcName](params);
  }
}
