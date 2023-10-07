import 'reflect-metadata';
import { z } from 'zod';
import { MockDataRef } from './library-container';

export function Library(label: string) {
  return function (target: any) {
    Reflect.defineMetadata(`logic-library:${label}`, true, target);
  };
}

export function MockData(exampleData: MockDataRef[]) {
  return function (target: any) {
    Reflect.defineMetadata(
      `exampleData`,
      {
        exampleData,
      },
      target
    );
  };
}

export function Define(label: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(
      `statement:${propertyKey}`,
      {
        label,
      },
      target.constructor
    );
  };
}

export function Documentation(label: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(
      `documentation:${propertyKey}`,
      {
        label,
      },
      target.constructor
    );
  };
}

type Func = (...args: any[]) => any;

export function Params(schema: z.Schema) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<Func>
  ) {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      throw new Error('Expecting descriptor.value');
    }

    Reflect.defineMetadata(
      `params:${propertyKey}`,
      {
        schema,
      },
      target.constructor
    );

    descriptor.value = function (...args: any[]) {
      const val = originalMethod.apply(this, args);
      return val;
    };
  };
}

export function ReturnType(schema: z.Schema) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<Func>
  ) {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      throw new Error('Expecting descriptor.value');
    }

    Reflect.defineMetadata(
      `returnType:${propertyKey}`,
      {
        schema,
      },
      target.constructor
    );

    descriptor.value = function (...args: any[]) {
      const val = originalMethod.apply(this, args);
      return val;
    };
  };
}
