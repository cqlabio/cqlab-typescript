import "reflect-metadata";
import { z } from "zod";

export function logic(label: string) {  
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(`statement:${propertyKey}`, {
      label
    }, target.constructor);
  };
}

export function documentation(label: string) {  
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(`documentation:${propertyKey}`, {
      label
    }, target.constructor);
  };
}

type Func = (...args: any[]) => any;

export function params(schema: z.Schema) {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Func>) {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      throw new Error("Expecint descriptor.value")
    }

    descriptor.value = function (...args: any[]) {
      console.log('ARGS', args)
            const val = originalMethod.apply(this, args);
      return val
    };

  };
}

export function Library(label: string) {
  return function (target: any) {
    Reflect.defineMetadata(`logic-library:${label}`, true, target);
  };
}