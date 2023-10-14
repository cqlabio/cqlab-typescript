const LOINC = 'http://loinc.org';

export interface Coding {
  system: string;
  code: string;
  display?: string;
}

export enum ExampleCodingsEnum {
  blood_pressure_panel = 'blood_pressure_panel',
  systolic_blood_pressure = 'systolic_blood_pressure',
  diastolic_blood_pressure = 'diastolic_blood_pressure',
  cholesterol_ratio = 'cholesterol_ratio',
}

export const ExampleCodings: Record<ExampleCodingsEnum, Coding> = {
  [ExampleCodingsEnum.blood_pressure_panel]: {
    system: LOINC,
    code: '85354-9',
    display: 'Blood pressure panel with all children optional',
  },

  [ExampleCodingsEnum.systolic_blood_pressure]: {
    system: LOINC,
    code: '8480-6',
    display: 'Systolic blood pressure',
  },

  [ExampleCodingsEnum.diastolic_blood_pressure]: {
    system: LOINC,
    code: '8462-4',
    display: 'Diastolic blood pressure',
  },
  [ExampleCodingsEnum.cholesterol_ratio]: {
    system: LOINC,
    code: '9830-1',
    display: 'Cholesterol in HDL [Mass Ratio] in Serum or Plasma',
  },
};
