// Map of system to code
type SystemCodeIndex = Map<string, Set<string>>;

export class IndexedValueSet {
  private valueset: fhir4.ValueSet;

  private codeIndex?: SystemCodeIndex;

  constructor(vs: fhir4.ValueSet) {
    this.valueset = vs;
  }

  getId(): string {
    if (!this.valueset.id) {
      throw new Error('ValueSet has no id');
    }
    return this.valueset.id;
  }

  getOriginalValueSet() {
    return this.valueset;
  }

  hasCoding(coding: fhir4.Coding): boolean {
    if (!coding.code || !coding.system) {
      return false;
    }

    if (!this.codeIndex) {
      this._buildCodeIndex();
    }

    const systemMap = this.codeIndex?.get(coding.system);
    if (!systemMap) {
      return false;
    }

    return systemMap.has(coding.code);
  }

  getAllCodes(): fhir4.Coding[] {
    return this._gatherCodesFromValueSet();
  }

  private _buildCodeIndex() {
    const codeIndex: SystemCodeIndex = new Map();

    const codes = this._gatherCodesFromValueSet();

    codes.forEach((code) => {
      if (code.code && code.system) {
        if (!codeIndex.has(code.system)) {
          codeIndex.set(code.system, new Set());
        }
        codeIndex.get(code.system)?.add(code.code);
      }
    });

    this.codeIndex = codeIndex;
  }

  private _gatherCodesFromValueSet(): fhir4.Coding[] {
    const codings: fhir4.Coding[] = [];

    this.valueset.expansion?.contains?.forEach((code) => {
      codings.push({
        code: code.code,
        system: code.system,
        display: code.display,
      });
    });

    return codings;
  }
}
