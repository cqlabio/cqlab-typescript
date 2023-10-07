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
  className: string;
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
      key.startsWith('logic-library:')
    ) as string | undefined;

    if (!foundLibraryKey) {
      throw new Error('Target is not injectable');
    }

    foundKeys.forEach((key: string) => {
      if (key === foundLibraryKey) {
        return;
      }

      const libName = target.name;
      const displayName = getElName(foundLibraryKey);

      if (key === 'exampleData') {
        const examples = Reflect.getMetadata(key, target);

        if (!this.registry[libName]) {
          this.registry[libName] = {
            className: target.name,
            label: displayName,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libName].mockData) {
          this.registry[libName].mockData = [];
        }

        if (examples.exampleData) {
          this.registry[libName].mockData?.push(...examples.exampleData);
        }
      }

      if (key.startsWith('statement:')) {
        const statement = Reflect.getMetadata(key, target);

        const funcName = getElName(key);

        if (!this.registry[libName]) {
          this.registry[libName] = {
            className: target.name,
            label: displayName,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libName].definitions[funcName]) {
          this.registry[libName].definitions[funcName] = {
            funcName,
            label: '',
          };
        }
        this.registry[libName].definitions[funcName].label = statement.label;
      }

      // if (key.startsWith('exampleData:')) {
      //   const exampleData = Reflect.getMetadata(key, target);

      //   const funcName = getElName(key);

      //   if (!this.registry[libName]) {
      //     this.registry[libName] = {
      //       className: target.name,
      //       label: displayName,
      //       definitions: {},
      //       klass: target,
      //     };
      //   }

      //   if (!this.registry[libName].definitions[funcName]) {
      //     this.registry[libName].definitions[funcName] = {
      //       funcName,
      //       label: '',
      //     };
      //   }

      //   this.registry[libName].definitions[funcName].documentation =
      //     documentation.label;
      // }

      if (key.startsWith('documentation:')) {
        const documentation = Reflect.getMetadata(key, target);

        const funcName = getElName(key);

        if (!this.registry[libName]) {
          this.registry[libName] = {
            className: target.name,
            label: displayName,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libName].definitions[funcName]) {
          this.registry[libName].definitions[funcName] = {
            funcName,
            label: '',
          };
        }

        this.registry[libName].definitions[funcName].documentation =
          documentation.label;
      }

      if (key.startsWith('params:')) {
        const params = Reflect.getMetadata(key, target);

        const funcName = getElName(key);

        if (!this.registry[libName]) {
          this.registry[libName] = {
            className: target.name,
            label: displayName,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libName].definitions[funcName]) {
          this.registry[libName].definitions[funcName] = {
            funcName,
            label: '',
          };
        }

        this.registry[libName].definitions[funcName].params = zodToJsonSchema(
          params.schema
        );
      }

      if (key.startsWith('returnType:')) {
        const returnType = Reflect.getMetadata(key, target);

        const funcName = getElName(key);

        if (!this.registry[libName]) {
          this.registry[libName] = {
            className: target.name,
            label: displayName,
            definitions: {},
            klass: target,
          };
        }

        if (!this.registry[libName].definitions[funcName]) {
          this.registry[libName].definitions[funcName] = {
            funcName,
            label: '',
          };
        }

        this.registry[libName].definitions[funcName].returnType =
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
