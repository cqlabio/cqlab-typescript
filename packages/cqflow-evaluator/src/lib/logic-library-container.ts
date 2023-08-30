import {  LogicLibrary, LogicLibraryOpts } from './logic-library'

const getElName = (el: string) => el.split(':')[1]

interface LibraryFunction {
  funcName: string
  label: string
  documentation ?: string
}

interface Library {
  label: string
  klass: any
  statements: Record<string, LibraryFunction>
}

export class LibraryContainer<T> {

  private registry: Record<string, Library> = {}

  getRegistry() {
    return this.registry
  }

  add(target: any): void {

    const foundKeys = Reflect.getOwnMetadataKeys(target)
    const foundLibraryKey = foundKeys.find(key => key.startsWith('logic-library:')) as string  | undefined

    if (!foundLibraryKey) {
      throw new Error("Target is not injectable");
    }

    foundKeys.forEach((key: string) => {
      if (key === foundLibraryKey) {
        return;
      }

      const libName = getElName(foundLibraryKey)

      if (key.startsWith('statement:')) {
        const statement = Reflect.getMetadata(key, target)

        const funcName = getElName(key)


        if (!this.registry[libName]) {
          this.registry[libName] = {
            label: libName,
            statements: {},
            klass: target
          }
        }

        if (!this.registry[libName].statements[funcName]) {
          this.registry[libName].statements[funcName] = {
            funcName,
            label: ''
          }
        }
        this.registry[libName].statements[funcName].label = statement.label
      }

      if (key.startsWith('documentation:')) {
        const documentation = Reflect.getMetadata(key, target)

        const funcName = getElName(key)

        if (!this.registry[libName]) {
          this.registry[libName] = {
            label:libName,
            statements: {},
            klass: target
          }
        }

        if (!this.registry[libName].statements[funcName]) {
          this.registry[libName].statements[funcName] = {
            funcName,
            label: ''
          }
        }

        this.registry[libName].statements[funcName].documentation = documentation.label
      }

    })

  }

  

  getLogic(libraryName: string, functionName: string, opts: LogicLibraryOpts ) {
    const klass = this.registry[libraryName].klass
    const found = this.registry[libraryName].statements[functionName]

    const instance = new klass(opts)
    return new LogicInstance(instance, found.funcName)
  }
}


class LogicInstance {
  logicLibraryInstance: any
  funcName: string;

  constructor(logicLibraryInstance: any, funcName: string) {
    this.logicLibraryInstance = logicLibraryInstance
    this.funcName = funcName 
  }

  execute() {
    return   this.logicLibraryInstance[this.funcName]()
  }
}