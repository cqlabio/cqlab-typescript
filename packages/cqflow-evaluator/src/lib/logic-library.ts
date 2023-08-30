
export interface LogicLibraryOpts {
  patientId: string;
}

export class LogicLibrary {
  opts: LogicLibraryOpts;
  
  constructor(opts: LogicLibraryOpts) {
    this.opts = opts;
  }
}